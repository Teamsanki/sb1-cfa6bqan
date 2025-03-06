import { ref, set, push, get, query, orderByChild, equalTo } from 'firebase/database';
import { rtdb, dbRefs } from '../firebase';

export const createUser = async (uid: string, userData: any) => {
  await set(ref(rtdb, `${dbRefs.users}/${uid}`), {
    ...userData,
    createdAt: Date.now()
  });
};

export const createPost = async (userId: string, postData: any) => {
  const newPostRef = push(ref(rtdb, dbRefs.posts));
  await set(newPostRef, {
    ...postData,
    userId,
    timestamp: Date.now(),
    likes: {},
    comments: {}
  });
  return newPostRef.key;
};

export const createStory = async (userId: string, storyData: any) => {
  const newStoryRef = push(ref(rtdb, dbRefs.stories));
  await set(newStoryRef, {
    ...storyData,
    userId,
    timestamp: Date.now()
  });
  return newStoryRef.key;
};

export const sendMessage = async (chatId: string, senderId: string, message: string) => {
  const newMessageRef = push(ref(rtdb, `${dbRefs.chats}/${chatId}/messages`));
  await set(newMessageRef, {
    senderId,
    text: message,
    timestamp: Date.now()
  });
  return newMessageRef.key;
};

export const createCall = async (callData: any) => {
  const newCallRef = push(ref(rtdb, dbRefs.calls));
  await set(newCallRef, {
    ...callData,
    timestamp: Date.now(),
    status: 'pending'
  });
  return newCallRef.key;
};

export const createReel = async (userId: string, reelData: any) => {
  const newReelRef = push(ref(rtdb, dbRefs.reels));
  await set(newReelRef, {
    ...reelData,
    userId,
    timestamp: Date.now(),
    likes: {},
    comments: {}
  });
  return newReelRef.key;
};

export const createNotification = async (userId: string, notificationData: any) => {
  const newNotificationRef = push(ref(rtdb, `${dbRefs.notifications}/${userId}`));
  await set(newNotificationRef, {
    ...notificationData,
    timestamp: Date.now(),
    read: false
  });
  return newNotificationRef.key;
};

export const getUserPosts = async (userId: string) => {
  const postsRef = ref(rtdb, dbRefs.posts);
  const userPostsQuery = query(postsRef, orderByChild('userId'), equalTo(userId));
  const snapshot = await get(userPostsQuery);
  return snapshot.val();
};

export const getUserStories = async (userId: string) => {
  const storiesRef = ref(rtdb, dbRefs.stories);
  const userStoriesQuery = query(storiesRef, orderByChild('userId'), equalTo(userId));
  const snapshot = await get(userStoriesQuery);
  return snapshot.val();
};

export const getRecentChats = async (userId: string) => {
  const chatsRef = ref(rtdb, dbRefs.chats);
  const snapshot = await get(chatsRef);
  const chats = snapshot.val();
  return Object.entries(chats || {})
    .filter(([_, chat]: [string, any]) => chat.participants?.[userId])
    .map(([chatId, chat]: [string, any]) => ({
      chatId,
      ...chat
    }));
};

export const getUserNotifications = async (userId: string) => {
  const notificationsRef = ref(rtdb, `${dbRefs.notifications}/${userId}`);
  const snapshot = await get(notificationsRef);
  return snapshot.val();
};