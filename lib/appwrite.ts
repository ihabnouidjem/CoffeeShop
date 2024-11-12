import Signin from "@/app/(auth)/sign-in";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage
} from "react-native-appwrite";

export const config = {
  endpoint: "https:/cloud.appwrite.io/v1",
  platform: "com.ihab.Aora",
  projectId: "672aa780002cb5076a12",
  databaseId: "672aa96f00310ed7e328",
  userCollectionId: "672aa98d001007b7b359",
  videoCollectionId: "672aa9b80033a857ca2e",
  storageId: "672aaaf1000f21681ff9",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);


export const createUser = async (email : any, password:any, username:any) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      { accountId: newAccount.$id, email, username, avatar: avatarUrl }
    );

    return newUser;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email:any, password:any ) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser?.documents[0];
  } catch (error: any) {
    console.log(error);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId,[Query.orderDesc('$createdAt')]);
    return posts.documents;
  } catch (error: any) {
    console.log(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId,[Query.orderDesc('$createdAt')]);
    return posts.documents;
  } catch (error: any) {
    console.log(error);
  }
};

export const getSearchPosts = async (query:any) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId,[Query.search('title',query)]);
    return posts.documents;
  } catch (error: any) {
    console.log(error);
  }
};

export const getUserPosts = async (userId:any) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId,[Query.equal('users',userId)]);
    return posts.documents;
  } catch (error: any) {
    console.log(error);
  }
};

export const SignOut = async () => {
  try {
    const session = await account.deleteSession('current')
    return session
  } catch (error : any) {
    throw new Error(error)
  }
}

export const getFilePreview = async (fileId:any, type:any) => {
  let fileUrl;

  try {
    if (type === 'video') {
      fileUrl = storage.getFileView(storageId, fileId)
    } else if (type === 'image') {
      fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100)
    } else {
      throw new Error('Invalid file type')
    }

      if (!fileUrl) throw new Error

      return fileUrl
  } catch (error:any) {
    throw new Error(error)
  }
}

export const uploadFile = async (file:any, type:any) => {
  if (!file) return

  const { mimeType, ...rest } = file
  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
}

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    )

    const fileUrl = await getFilePreview(uploadedFile?.$id, type)
    return fileUrl
  } catch (error : any) {
    throw new Error(error)
  }
}


export const createVideo = async (form:any) => {
try {
  const [thumbnailUrl, videoUrl] = await Promise.all([
    uploadFile(form.thumbnail, 'image'),
    uploadFile(form.video, 'video')
  ])

  const newPost = await databases.createDocument(
    databaseId,
    videoCollectionId,
    ID.unique(),
    { title: form.title , thumbnail: thumbnailUrl, video: videoUrl, prompt:form.prompt, users: form.userId}
  )

  return newPost
} catch (error : any) {
  throw new Error(error)
}
}