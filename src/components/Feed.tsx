import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../firebase';
import Post from './Post';
import Story from './Story';
import { useUserStore } from '../store/userStore';

interface PostData {
  id: string;
  userId: string;
  username: string;
  userImage: string;
  image: string;
  caption: string;
  likes: string[];
  comments: {
    id: string;
    username: string;
    text: string;
    timestamp: any;
  }[];
  timestamp: any;
}

const Feed: React.FC = () => {
  const { user } = useUserStore();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from Firestore
  useEffect(() => {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, orderBy('timestamp', 'desc'), limit(10));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsList: PostData[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        postsList.push({
          id: doc.id,
          userId: data.userId,
          username: data.username,
          userImage: data.userImage,
          image: data.image,
          caption: data.caption,
          likes: data.likes || [],
          comments: data.comments || [],
          timestamp: data.timestamp
        });
      });
      
      setPosts(postsList);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // Mock stories data
  const STORIES = [
    { id: 1, username: 'your_story', userImage: user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde", isYours: true },
    { id: 2, username: 'janedoe', userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' },
    { id: 3, username: 'traveler', userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' },
    { id: 4, username: 'foodie', userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80' },
    { id: 5, username: 'photographer', userImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e' },
    { id: 6, username: 'designer', userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
    { id: 7, username: 'artist', userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' },
    { id: 8, username: 'musician', userImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6' }
  ];

  return (
    <div className="max-w-xl mx-auto">
      {/* Stories */}
      <div className="bg-white border border-gray-200 rounded-lg mb-4 p-4 overflow-x-auto">
        <div className="flex space-x-4">
          {STORIES.map((story) => (
            <Story key={story.id} story={story} />
          ))}
        </div>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
          <p className="text-gray-500 mb-4">Start following people or create your first post</p>
        </div>
      )}
    </div>
  );
};

export default Feed;