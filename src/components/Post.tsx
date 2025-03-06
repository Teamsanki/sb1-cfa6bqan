import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useUserStore } from '../store/userStore';
import { v4 as uuidv4 } from 'uuid';

interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: any;
}

interface PostProps {
  post: {
    id: string;
    userId: string;
    username: string;
    userImage: string;
    image: string;
    caption: string;
    likes: string[];
    comments: Comment[];
    timestamp: any;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { user } = useUserStore();
  const [comment, setComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const isLiked = user ? post.likes.includes(user.uid) : false;

  const handleLike = async () => {
    if (!user) return;
    
    const postRef = doc(db, 'posts', post.id);
    
    try {
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(user.uid)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(user.uid)
        });
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim() || submitting) return;
    
    setSubmitting(true);
    
    const postRef = doc(db, 'posts', post.id);
    const newComment = {
      id: uuidv4(),
      username: user.displayName,
      text: comment,
      timestamp: Timestamp.now()
    };
    
    try {
      await updateDoc(postRef, {
        comments: arrayUnion(newComment)
      });
      
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    
    const now = new Date();
    const postDate = timestamp.toDate();
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return postDate.toLocaleDateString();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-4">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center">
          <img
            src={post.userImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.username)}`}
            alt={post.username}
            className="h-8 w-8 rounded-full object-cover mr-2"
          />
          <span className="font-semibold">{post.username}</span>
        </div>
        <button>
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Post Image */}
      <img
        src={post.image}
        alt="Post"
        className="w-full object-cover"
        style={{ maxHeight: '600px' }}
      />

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="flex space-x-4">
            <button onClick={handleLike}>
              <Heart
                className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
              />
            </button>
            <button>
              <MessageCircle className="h-6 w-6" />
            </button>
            <button>
              <Send className="h-6 w-6" />
            </button>
          </div>
          <button>
            <Bookmark className="h-6 w-6" />
          </button>
        </div>

        {/* Likes */}
        <p className="font-semibold">{post.likes.length} likes</p>

        {/* Caption */}
        <p className="mt-1">
          <span className="font-semibold mr-1">{post.username}</span>
          {post.caption}
        </p>

        {/* Comments */}
        {post.comments.length > 0 && (
          <div className="mt-2">
            {!showAllComments && post.comments.length > 2 && (
              <button
                className="text-gray-500 text-sm"
                onClick={() => setShowAllComments(true)}
              >
                View all {post.comments.length} comments
              </button>
            )}
            {(showAllComments ? post.comments : post.comments.slice(0, 2)).map((comment) => (
              <p key={comment.id} className="text-sm">
                <span className="font-semibold mr-1">{comment.username}</span>
                {comment.text}
              </p>
            ))}
          </div>
        )}

        {/* Time */}
        <p className="text-gray-500 text-xs mt-1">
          {formatTimestamp(post.timestamp)}
        </p>

        {/* Add Comment */}
        <form onSubmit={handleComment} className="mt-3 flex">
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 bg-transparent focus:outline-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          {comment.trim() && (
            <button
              type="submit"
              disabled={submitting}
              className="text-blue-500 font-semibold disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Post;