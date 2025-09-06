import {
  query,
  databases,
  generateID,
  dbID,
  affirmationCollectionID,
} from "./appwrite";

export class AffirmationService {
  static async createAffirmations(formData) {
    const res = databases.createDocument(
      dbID,
      affirmationCollectionID,
      generateID(),
      formData
      // [`user:${formData.user_id}`]
    );
    return res;
  }

  static async listAffirmations(userId) {
    if (!userId) return [];

    const res = await databases.listDocuments(dbID, affirmationCollectionID, [
      // query affirmations belonging to user
      query.equal("user_id", [userId]),
    ]);
    return res.documents;
  }
}
