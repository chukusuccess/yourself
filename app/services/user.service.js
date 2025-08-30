import {
  account,
  query,
  databases,
  generateID,
  dbID,
  profileCollectionID,
  friendsCollectionID,
} from "./appwrite";

export class UserService {
  static async createUserProfile() {
    const res = databases.createDocument(
      dbID,
      profileCollectionID,
      formData.user_id,
      formData
      // [`user:${formData.user_id}`]
    );
    return res;
  }

  static async getProfile(uid) {
    const res = databases.getDocument(dbID, profileCollectionID, uid);
    return res;
  }

  static async getReferralLink() {
    // get current logged-in user
    const user = await account.get();

    if (!user?.$id) return null;

    // fetch profile document by user ID
    const profile = await databases.getDocument(
      dbID,
      profileCollectionID,
      user.$id
    );

    if (!profile?.ref_code) return null;

    // build invite URL
    const url = `https://yourself-virid.vercel.app/home/friends?ref=${profile.ref_code}`;
    return url;
  }

  static async listFriends(userId) {
    const res = await databases.listDocuments(dbID, friendsCollectionID, [
      query.equal("user_id", [userId]),
    ]);

    // Get all friend profile IDs
    const friendIds = res.documents.map((f) => f.friend_id);

    if (friendIds.length === 0) return [];

    // Fetch corresponding profiles
    const profilesRes = await databases.listDocuments(
      dbID,
      profileCollectionID,
      [query.equal("$id", [...friendIds])]
    );

    return res.documents.map((f) => {
      const profile = profilesRes.documents.find((p) => p.$id === f.friend_id);
      console.log(profile);
      return {
        value: f.friend_id,
        label: profile?.full_name,
      };
    });
  }

  // 🔍 find inviter profile by referral code
  static async getInviterByRefCode(refCode) {
    const res = await databases.listDocuments(dbID, profileCollectionID, [
      query.equal("ref_code", [refCode]),
    ]);

    if (res.documents.length === 0) return null;
    return res.documents[0];
  }

  // 🤝 add mutual friendship (A → B and B → A)
  static async addMutualFriends(userId, inviterId) {
    // avoid duplicate entries: optional, but nice to have
    const existing = await databases.listDocuments(dbID, friendsCollectionID, [
      query.equal("user_id", [userId]),
      query.equal("friend_id", [inviterId]),
    ]);

    if (existing.documents.length > 0) {
      return { success: true, message: "Already friends" };
    }

    await databases.createDocument(dbID, friendsCollectionID, generateID(), {
      user_id: userId,
      friend_id: inviterId,
    });

    await databases.createDocument(dbID, friendsCollectionID, generateID(), {
      user_id: inviterId,
      friend_id: userId,
    });

    return { success: true };
  }
}
