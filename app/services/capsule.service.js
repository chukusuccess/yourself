import {
  databases,
  generateID,
  query,
  dbID,
  capsuleCollectionID,
  capsuleRecipientCollectionID,
} from "./appwrite";

export class CapsuleService {
  // ✅ Create capsule
  static async createTimeCapsule(formData, recipients = []) {
    // Step 1: create capsule
    const capsule = await databases.createDocument(
      dbID,
      capsuleCollectionID,
      generateID(),
      formData
    );

    // Step 2: if public (not private), attach recipients
    if (!formData.is_private && recipients.length > 0) {
      databases.createDocument(
        dbID,
        capsuleRecipientCollectionID,
        generateID(),
        {
          capsule_id: capsule.$id,
          recipient_ids: recipients,
        }
      );
    }

    return capsule;
  }

  // ✅ Fetch all capsules (sent by user + received by user)
  static async listTimeCapsules(userId) {
    if (!userId) return [];

    // Step 1: capsules I sent
    const sentRes = await databases.listDocuments(dbID, capsuleCollectionID, [
      query.equal("sender_id", [userId]),
      query.orderAsc("delivery_date"),
    ]);

    // Step 2: capsules sent TO me
    const receivedRes = await databases.listDocuments(
      dbID,
      capsuleRecipientCollectionID,
      [query.contains("recipient_ids", [userId])]
    );

    // For each recipient entry, fetch the actual capsule doc
    let receivedCapsules = [];
    if (receivedRes.documents.length > 0) {
      const capsuleIds = receivedRes.documents.map((r) => r.capsule_id);
      const capsuleDocs = await databases.listDocuments(
        dbID,
        capsuleCollectionID,
        [query.equal("$id", capsuleIds)]
      );
      receivedCapsules = capsuleDocs.documents;
    }

    return [...sentRes.documents, ...receivedCapsules];
  }
}
