import { databases, generateID, dbID, collectionID } from "./appwrite";

export class DatabaseService {
  static async createUserDB(uid) {
    const res = databases.createDocument(dbID, collectionID, generateID, {
      userID: uid,
      userHistory: "",
    });
    return res;
  }

  static async getHistory(uid) {
    const res = databases.getDocument(dbID, collectionID, uid);
    return res;
  }

  static addItemToHistory(data, uid) {
    //POSTPONED
    const res = databases.updateDocument(dbID, collectionID, uid, data);
    return res;
  }
}
