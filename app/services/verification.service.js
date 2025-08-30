import {
  databases,
  query,
  generateID,
  dbID,
  verificationRequestsCollectionID,
  habitCollectionID,
  profileCollectionID,
} from "./appwrite";

export class VerificationService {
  // ✅ Create requests (1 per witness)
  static async createRequests(habitId, requesterId, witnesses) {
    const promises = witnesses.map((w) =>
      databases.createDocument(
        dbID,
        verificationRequestsCollectionID,
        generateID(),
        {
          habit_id: habitId,
          requester_id: requesterId,
          witness_id: w.user_id, // keep consistent with profile.user_id
          status: "pending",
        }
      )
    );

    return Promise.all(promises);
  }

  // ✅ List requests for a witness
  static async listRequests(witnessId) {
    const res = await databases.listDocuments(
      dbID,
      verificationRequestsCollectionID,
      [
        query.equal("witness_id", [witnessId]),
        query.equal("status", ["pending"]),
        query.orderDesc("$createdAt"),
      ]
    );

    // Enrich with habit + requester profile
    if (res.documents.length === 0) return [];

    const habitIds = res.documents.map((r) => r.habit_id);
    const requesterIds = res.documents.map((r) => r.requester_id);

    // Fetch habits
    const habitsRes = await databases.listDocuments(dbID, habitCollectionID, [
      query.equal("$id", habitIds),
    ]);
    const habitMap = {};
    habitsRes.documents.forEach((h) => {
      habitMap[h.$id] = h;
    });

    // Fetch profiles
    const profilesRes = await databases.listDocuments(
      dbID,
      profileCollectionID,
      [query.equal("user_id", requesterIds)]
    );
    const profileMap = {};
    profilesRes.documents.forEach((p) => {
      profileMap[p.user_id] = p;
    });

    // Merge
    return res.documents.map((req) => ({
      ...req,
      habit_title: habitMap[req.habit_id]?.title || "Unknown Habit",
      requester_name: profileMap[req.requester_id]?.full_name || "Unknown User",
    }));
  }

  // ✅ Respond to request
  static async respondRequest(requestId, status) {
    return databases.updateDocument(
      dbID,
      verificationRequestsCollectionID,
      requestId,
      { status }
    );
  }
}
