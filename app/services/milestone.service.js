import { query } from "./appwrite";
import {
  databases,
  generateID,
  dbID,
  milestonesCollectionID,
} from "./appwrite";

export class MilestoneService {
  static async createMilestone(formData) {
    const res = databases.createDocument(
      dbID,
      milestonesCollectionID,
      generateID(),
      formData
      // [`user:${formData.user_id}`]
    );
    return res;
  }

  static async listMilestones(userId) {
    if (!userId) return [];

    const res = await databases.listDocuments(dbID, milestonesCollectionID, [
      // query milestones belonging to user
      query.equal("user_id", [userId]),
      query.orderAsc("milestone_date"),
    ]);
    return res.documents;
  }
}
