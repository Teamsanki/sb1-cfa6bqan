import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, User, MessageCircle, Video } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full z-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <Link
            to="/"
            className={`flex flex-col items-center ${
              path === '/' ? 'text-purple-600' : 'text-gray-500'
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link
            to="/explore"
            className={`flex flex-col items-center ${
              path === '/explore' ? 'text-purple-600' : 'text-gray-500'
            }`}
          >
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">Explore</span>
          </Link>
          
          <Link
            to="/reels"
            className={`flex flex-col items-center ${
              path === '/reels' ? 'text-purple-600' : 'text-gray-500'
            }`}
          >
            <Video className="h-6 w-6" />
            <span className="text-xs mt-1">Reels</span>
          </Link>
          
          <Link
            to="/create"
            className={`flex flex-col items-center ${
              path === '/create' ? 'text-purple-600' : 'text-gray-500'
            }`}
          >
            <PlusSquare className="h-6 w-6" />
            <span className="text-xs mt-1">Create</span>
          </Link>
          
          <Link
            to="/profile"
            className={`flex flex-col items-center ${
              path === '/profile' ? 'text-purple-600' : 'text-gray-500'
            }`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;