import { Client, Account, Databases, ID } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const generateID = ID.unique();
export const dbID = process.env.NEXT_PUBLIC_DATABASEID;
export const collectionID = process.env.NEXT_PUBLIC_COLLECTIONID;
