import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Search, MessageCircle, Video, Menu } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useUserStore } from '../store/userStore';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Camera className="h-8 w-8 mr-2 text-purple-600" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Social Bites
          </h1>
        </Link>
        
        <div className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-100 rounded-md pl-10 pr-3 py-2 w-64 focus:outline-none"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/reels" className="text-gray-800 hover:text-purple-600">
            <Video className="h-6 w-6" />
          </Link>
          <Link to="/chat" className="text-gray-800 hover:text-purple-600">
            <MessageCircle className="h-6 w-6" />
          </Link>
          <div className="relative group">
            <button className="flex items-center">
              <img
                src={user?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;