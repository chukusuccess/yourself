import {
  databases,
  query,
  generateID,
  dbID,
  habitCollectionID,
  habitStreaksCollectionID,
} from "./appwrite";
import dayjs from "dayjs";

export class StreakService {
  // ✅ Verify a habit for today (self-verification)
  static async verifyHabit(habitId, userId) {
    const today = dayjs().format("YYYY-MM-DD");

    // check if today's streak already exists
    const existing = await databases.listDocuments(
      dbID,
      habitStreaksCollectionID,
      [query.equal("habit_id", [habitId]), query.equal("date", [today])]
    );

    if (existing.documents.length > 0) {
      // already exists → update status
      const streakDoc = existing.documents[0];
      const updated = await databases.updateDocument(
        dbID,
        habitStreaksCollectionID,
        streakDoc.$id,
        { status: "verified" }
      );
      await this.updateHabitStreakCount(habitId, "verified");
      return updated;
    }

    // else → create new streak doc
    const newDoc = await databases.createDocument(
      dbID,
      habitStreaksCollectionID,
      generateID(),
      {
        habit_id: habitId,
        user_id: userId,
        date: today,
        status: "verified",
        streak_count: 1,
        start_date: today,
        last_verified: today,
      }
    );

    await this.updateHabitStreakCount(habitId, "verified");
    return newDoc;
  }

  // ✅ Skip a day (user gives up today)
  static async skipHabit(habitId, userId) {
    const today = dayjs().format("YYYY-MM-DD");

    const existing = await databases.listDocuments(
      dbID,
      habitStreaksCollectionID,
      [query.equal("habit_id", [habitId]), query.equal("date", [today])]
    );

    if (existing.documents.length > 0) {
      const streakDoc = existing.documents[0];
      const updated = await databases.updateDocument(
        dbID,
        habitStreaksCollectionID,
        streakDoc.$id,
        { status: "skipped" }
      );
      await this.updateHabitStreakCount(habitId, "skipped");
      return updated;
    }

    const newDoc = await databases.createDocument(
      dbID,
      habitStreaksCollectionID,
      generateID(),
      {
        habit_id: habitId,
        user_id: userId,
        date: today,
        status: "skipped",
        streak_count: 0,
        start_date: today,
        last_verified: today,
      }
    );

    await this.updateHabitStreakCount(habitId, "skipped");
    return newDoc;
  }

  // ✅ Helper: update habit streak_count + last_verified
  static async updateHabitStreakCount(habitId, status) {
    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    let newCount = 0;

    if (status === "verified") {
      // check if yesterday was verified → continue streak
      const yesterdays = await databases.listDocuments(
        dbID,
        habitStreaksCollectionID,
        [query.equal("habit_id", [habitId]), query.equal("date", [yesterday])]
      );

      if (
        yesterdays.documents.length > 0 &&
        yesterdays.documents[0].status === "verified"
      ) {
        const habit = await databases.getDocument(
          dbID,
          habitCollectionID,
          habitId
        );
        newCount = (habit.streak_count || 0) + 1;
      } else {
        newCount = 1; // new streak
      }
    }

    await databases.updateDocument(dbID, habitStreaksCollectionID, habitId, {
      streak_count: newCount,
      last_verified: today,
    });
  }

  // ✅ Get streaks for last N days (for checkin card)
  static async getRecentStreaks(habitId, days = 7) {
    const cutoff = dayjs()
      .subtract(days - 1, "day")
      .format("YYYY-MM-DD");

    const res = await databases.listDocuments(dbID, habitStreaksCollectionID, [
      query.equal("habit_id", [habitId]),
      query.greaterThanEqual("date", cutoff),
    ]);

    return res.documents;
  }
}
