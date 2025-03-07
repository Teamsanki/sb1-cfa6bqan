import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCWfoNPl2TQke0v9YuBSWJxQRU9PWvvVXo",
  authDomain: "social-bite-skofficial.firebaseapp.com",
  databaseURL: "https://social-bite-skofficial-default-rtdb.firebaseio.com",
  projectId: "social-bite-skofficial",
  storageBucket: "social-bite-skofficial.appspot.com",
  messagingSenderId: "239722707022",
  appId: "1:239722707022:web:57d9b173f2163e85be2b1f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

// Database references
export const dbRefs = {
  users: 'users',
  posts: 'posts',
  stories: 'stories',
  chats: 'chats',
  calls: 'calls',
  reels: 'reels',
  notifications: 'notifications'
};

// Security rules for Realtime Database
/*
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "users": {
      "$uid": {
        ".read": true,
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "posts": {
      ".read": true,
      ".write": "auth != null",
      "$postId": {
        ".validate": "newData.hasChildren(['userId', 'content', 'timestamp'])",
        "likes": {
          "$uid": {
            ".validate": "auth != null && auth.uid === $uid"
          }
        },
        "comments": {
          "$commentId": {
            ".validate": "newData.hasChildren(['userId', 'text', 'timestamp'])"
          }
        }
      }
    },
    "stories": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$storyId": {
        ".validate": "newData.hasChildren(['userId', 'mediaUrl', 'timestamp'])"
      }
    },
    "chats": {
      "$chatId": {
        ".read": "auth != null && (data.child('participants/' + auth.uid).exists())",
        ".write": "auth != null && (data.child('participants/' + auth.uid).exists())",
        "messages": {
          "$messageId": {
            ".validate": "newData.hasChildren(['senderId', 'text', 'timestamp'])"
          }
        }
      }
    },
    "calls": {
      "$callId": {
        ".read": "auth != null && (data.child('participants/' + auth.uid).exists())",
        ".write": "auth != null && (data.child('participants/' + auth.uid).exists())",
        ".validate": "newData.hasChildren(['initiator', 'receiver', 'type', 'status', 'timestamp'])"
      }
    },
    "reels": {
      ".read": true,
      ".write": "auth != null",
      "$reelId": {
        ".validate": "newData.hasChildren(['userId', 'videoUrl', 'caption', 'timestamp'])",
        "likes": {
          "$uid": {
            ".validate": "auth != null && auth.uid === $uid"
          }
        },
        "comments": {
          "$commentId": {
            ".validate": "newData.hasChildren(['userId', 'text', 'timestamp'])"
          }
        }
      }
    },
    "notifications": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null",
        "$notificationId": {
          ".validate": "newData.hasChildren(['type', 'fromUserId', 'timestamp'])"
        }
      }
    }
  }
}
*/

export default app;
