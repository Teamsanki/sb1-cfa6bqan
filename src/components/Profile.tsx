import React, { useState, useEffect } from 'react';
import { Grid, Bookmark, Tag, Settings, LogOut } from 'lucide-react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useUserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';

interface PostData {
  id: string;
  image: string;
  likes: string[];
  comments: any[];
}

const Profile: React.FC = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState('');
  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);

  // Fetch user posts
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const userPosts: PostData[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userPosts.push({
            id: doc.id,
            image: data.image,
            likes: data.likes || [],
            comments: data.comments || []
          });
        });
        
        setPosts(userPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [user]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', user.uid)));
        
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          setBio(userData.bio || '');
          setEditedBio(userData.bio || '');
          setFollowers(userData.followers || []);
          setFollowing(userData.following || []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, [user]);

  const handleSaveBio = async () => {
    if (!user) return;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        bio: editedBio
      });
      
      setBio(editedBio);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="md:mr-8 mb-4 md:mb-0">
            <div className="h-24 w-24 md:h-36 md:w-36 rounded-full overflow-hidden">
              <img
                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}`}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center mb-4">
              <h2 className="text-xl font-semibold mb-2 md:mb-0 md:mr-4">{user.displayName}</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-gray-100 px-4 py-1 rounded font-semibold text-sm"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                <button className="text-gray-500">
                  <Settings className="h-5 w-5" />
                </button>
                <button onClick={handleLogout} className="text-red-500">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex justify-center md:justify-start space-x-6 mb-4">
              <div>
                <span className="font-semibold">{posts.length}</span> posts
              </div>
              <div>
                <span className="font-semibold">{followers.length}</span> followers
              </div>
              <div>
                <span className="font-semibold">{following.length}</span> following
              </div>
            </div>
            
            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  placeholder="Write your bio..."
                  className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  maxLength={150}
                ></textarea>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">{editedBio.length}/150</span>
                  <button
                    onClick={handleSaveBio}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="font-semibold">{user.displayName}</p>
                <p>{bio || 'No bio yet'}</p>
                <p className="text-blue-500">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <div className="flex justify-center">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center px-4 py-2 ${
                activeTab === 'posts'
                  ? 'border-t border-black text-black'
                  : 'text-gray-500'
              }`}
            >
              <Grid className="h-4 w-4 mr-1" />
              <span className="text-xs uppercase font-semibold">Posts</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center px-4 py-2 ${
                activeTab === 'saved'
                  ? 'border-t border-black text-black'
                  : 'text-gray-500'
              }`}
            >
              <Bookmark className="h-4 w-4 mr-1" />
              <span className="text-xs uppercase font-semibold">Saved</span>
            </button>
            <button
              onClick={() => setActiveTab('tagged')}
              className={`flex items-center px-4 py-2 ${
                activeTab === 'tagged'
                  ? 'border-t border-black text-black'
                  : 'text-gray-500'
              }`}
            >
              <Tag className="h-4 w-4 mr-1" />
              <span className="text-xs uppercase font-semibold">Tagged</span>
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-1 p-1">
            {posts.map((post) => (
              <div key={post.id} className="relative aspect-square">
                <img
                  src={post.image}
                  alt={`Post ${post.id}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex items-center text-white mr-3">
                    <Heart className="h-5 w-5 mr-1 fill-white" />
                    <span>{post.likes.length}</span>
                  </div>
                  <div className="flex items-center text-white">
                    <MessageCircle className="h-5 w-5 mr-1 fill-white" />
                    <span>{post.comments.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
            <p className="text-gray-500 mb-4">Share photos and videos that will appear on your profile</p>
            <button
              onClick={() => navigate('/create')}
              className="bg-blue-500 text-white px-4 py-2 rounded font-medium"
            >
              Share your first photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;