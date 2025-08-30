import {
  databases,
  query,
  generateID,
  dbID,
  habitCollectionID,
  habitWitnessesCollectionID,
  habitStreaksCollectionID,
  profileCollectionID,
} from "./appwrite";

export class HabitService {
  // ✅ Create Habit
  static async createHabit(formData, witnesses = []) {
    // Step 1: create habit
    const habit = await databases.createDocument(
      dbID,
      habitCollectionID,
      generateID(),
      {
        ...formData,
        witness_required: witnesses.length > 0,
      }
    );

    // Step 2: if witnesses are selected, create a single witnesses doc
    if (witnesses.length > 0) {
      await databases.createDocument(
        dbID,
        habitWitnessesCollectionID,
        generateID(),
        {
          habit_id: habit.$id,
          witness_ids: witnesses, // string[]
        }
      );
    }

    return habit;
  }

  // ✅ List Habits (with witnesses + latest streak info)
  static async listHabits(userId) {
    if (!userId) return [];

    // 1. Fetch habits
    const habitsRes = await databases.listDocuments(dbID, habitCollectionID, [
      query.equal("user_id", [userId]),
      query.orderAsc("$createdAt"),
    ]);
    const habits = habitsRes.documents;
    if (habits.length === 0) return [];

    // 2. Fetch witnesses (same as before)
    const habitIds = habits.map((h) => h.$id);
    const witnessesRes = await databases.listDocuments(
      dbID,
      habitWitnessesCollectionID,
      [query.equal("habit_id", habitIds)]
    );

    const witnessesMap = {};
    witnessesRes.documents.forEach((w) => {
      witnessesMap[w.habit_id] = w;
    });

    // 3. Collect all witness IDs
    const allWitnessIds = witnessesRes.documents.flatMap((w) => w.witness_ids);
    const uniqueWitnessIds = [...new Set(allWitnessIds)];

    // 4. Fetch witness profiles
    let profilesMap = {};
    if (uniqueWitnessIds.length > 0) {
      const profilesRes = await databases.listDocuments(
        dbID,
        profileCollectionID,
        [query.equal("user_id", uniqueWitnessIds)]
      );
      profilesRes.documents.forEach((p) => {
        profilesMap[p.user_id] = p;
      });
    }

    // 5. Fetch latest streaks (for all habits at once)
    const streaksRes = await databases.listDocuments(
      dbID,
      habitStreaksCollectionID,
      [query.equal("habit_id", habitIds), query.orderDesc("date")]
    );

    // Pick the most recent streak per habit
    const streakMap = {};
    streaksRes.documents.forEach((s) => {
      if (!streakMap[s.habit_id]) {
        streakMap[s.habit_id] = s;
      }
    });

    // 6. Merge habits + witnesses + streaks
    return habits.map((h) => {
      const witnessDoc = witnessesMap[h.$id];
      const witnessProfiles = witnessDoc
        ? witnessDoc.witness_ids.map(
            (id) => profilesMap[id] || { user_id: id, name: "Unknown" }
          )
        : [];

      const streakDoc = streakMap[h.$id] || {};
      return {
        ...h,
        witnesses: witnessProfiles,
        streak_count: streakDoc.streak_count || 0,
        last_verified: streakDoc.last_verified || null,
      };
    });
  }

  // ✅ Delete Habit (and related witnesses)
  static async deleteHabit(habitId) {
    // Delete related witness doc (only one per habit)
    const witnesses = await databases.listDocuments(
      dbID,
      habitWitnessesCollectionID,
      [query.equal("habit_id", [habitId])]
    );

    const witnessDeletes = witnesses.documents.map((w) =>
      databases.deleteDocument(dbID, habitWitnessesCollectionID, w.$id)
    );

    // Delete the habit
    const habitDelete = databases.deleteDocument(
      dbID,
      habitCollectionID,
      habitId
    );

    await Promise.all([...witnessDeletes, habitDelete]);

    return true;
  }
}
