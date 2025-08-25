import { Client, Account, Databases, ID, Query } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const generateID = () => ID.unique();
export const query = Query;
export const dbID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;

export const userAcievementCollectionID =
  process.env.NEXT_PUBLIC_APPWRITE_USER_ACHIEVEMENT_COLLECTION_ID;
export const globalAchievementCollectionID =
  process.env.NEXT_PUBLIC_APPWRITE_GLOBAL_ACHIEVEMENT_COLLECTION_ID;
export const affirmationCollectionID =
  process.env.NEXT_PUBLIC_APPWRITE_AFFIRMATION_COLLECTION_ID;
export const capsuleRecipientCollectionID =
  process.env.NEXT_PUBLIC_APPWRITE_CAPSULE_RECIPIENT_COLLECTION_ID;
export const capsuleCollectionID =
  process.env.NEXT_PUBLIC_APPWRITE_TIME_CAPSULE_COLLECTION_ID;
export const habitStreaksCollectionID =
  process.env.NEXT_PUBLIC_APPWRITE_HABIT_STREAKS_COLLECTION_ID;
export const habitWitnessesCollectionID =
  process.env.NEXT_PUBLIC_APPWRITE_HABIT_WITNESSES_COLLECTION_ID;
export const habitCollectionID =
  process.env.NEXT_PUBLIC_APPWRITE_HABIT_COLLECTION_ID;
export const friendsCollectionID =
  process.env.NEXT_PUBLIC_APPWRITE_FRIENDS_COLLECTION_ID;
export const profileCollectionID =
  process.env.NEXT_PUBLIC_APPWRITE_PROFILE_COLLECTION_ID;
export const milestonesCollectionID =
  process.env.NEXT_PUBLIC_APPWRITE_MILESTONES_COLLECTION_ID;
