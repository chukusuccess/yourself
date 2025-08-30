import {
  databases,
  dbID,
  habitStreaksCollectionID,
  habitReviewsCollectionID,
  generateID,
} from "./appwrite";
import dayjs from "dayjs";

export class CheckinService {
  // ✅ Get current week's check-in (streaks + review)
  static async getWeeklyCheckin(habitId) {
    const startOfWeek = dayjs().startOf("week").format("YYYY-MM-DD");
    const endOfWeek = dayjs().endOf("week").format("YYYY-MM-DD");

    // Step 1: streaks for this week
    const res = await databases.listDocuments(dbID, habitStreaksCollectionID, [
      query.equal("habit_id", [habitId]),
      query.greaterThanEqual("date", startOfWeek),
      query.lessThanEqual("date", endOfWeek),
      query.orderAsc("date"),
    ]);

    const streaks = res.documents;

    // Normalize into week grid
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = dayjs(startOfWeek).add(i, "day");
      const formatted = d.format("YYYY-MM-DD");

      const streakDoc = streaks.find((s) => s.date === formatted);

      weekDays.push({
        day: d.format("dd"),
        tooltip: d.format("ddd, MMM D"),
        status: streakDoc ? streakDoc.status : "none",
        date: formatted,
      });
    }

    // Step 2: get weekly review (only one per habit per week)
    const reviewRes = await databases.listDocuments(
      dbID,
      habitReviewsCollectionID,
      [
        query.equal("habit_id", [habitId]),
        query.equal("week_start", [startOfWeek]),
      ]
    );

    const reviewText = reviewRes.documents[0]?.text || "";

    return {
      habitId,
      month: dayjs().format("MMMM YYYY"),
      streak: weekDays,
      reviewText,
    };
  }

  // ✅ Save/replace review for current week (on Sunday)
  static async saveWeeklyReview(habitId, text) {
    const startOfWeek = dayjs().startOf("week").format("YYYY-MM-DD");

    const res = await databases.listDocuments(dbID, habitReviewsCollectionID, [
      query.equal("habit_id", [habitId]),
      query.equal("week_start", [startOfWeek]),
    ]);

    if (res.documents.length > 0) {
      return databases.updateDocument(
        dbID,
        habitReviewsCollectionID,
        res.documents[0].$id,
        { text }
      );
    } else {
      return databases.createDocument(
        dbID,
        habitReviewsCollectionID,
        generateID(),
        {
          habit_id: habitId,
          week_start: startOfWeek,
          text,
        }
      );
    }
  }
}
