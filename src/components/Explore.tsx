import React from 'react';
import { Search } from 'lucide-react';

const EXPLORE_POSTS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1604537466608-109fa2f16c3b', likes: 234, comments: 15 },
  { id: 2, image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714', likes: 456, comments: 32 },
  { id: 3, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', likes: 789, comments: 45 },
  { id: 4, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f', likes: 123, comments: 8 },
  { id: 5, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba', likes: 345, comments: 21 },
  { id: 6, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445', likes: 567, comments: 39 },
  { id: 7, image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b', likes: 678, comments: 42 },
  { id: 8, image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8', likes: 890, comments: 56 },
  { id: 9, image: 'https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f', likes: 432, comments: 27 },
  { id: 10, image: 'https://images.unsplash.com/photo-1682686580391-c3e5a6819336', likes: 543, comments: 33 },
  { id: 11, image: 'https://images.unsplash.com/photo-1682686578707-140e0a37f1fe', likes: 654, comments: 41 },
  { id: 12, image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538', likes: 765, comments: 48 },
  { id: 13, image: 'https://images.unsplash.com/photo-1682687220208-22d7a2543e88', likes: 876, comments: 55 },
  { id: 14, image: 'https://images.unsplash.com/photo-1682687220067-dced9a881b56', likes: 987, comments: 62 },
  { id: 15, image: 'https://images.unsplash.com/photo-1682687220199-d0124f48f95b', likes: 321, comments: 20 }
];

const Explore: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Bar (Mobile Only) */}
      <div className="md:hidden mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-100 rounded-md pl-10 pr-3 py-2 w-full focus:outline-none"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto space-x-4 mb-4 pb-2 scrollbar-hide">
        <button className="bg-black text-white px-4 py-1 rounded-full text-sm whitespace-nowrap">
          For You
        </button>
        <button className="bg-gray-100 px-4 py-1 rounded-full text-sm whitespace-nowrap">
          Travel
        </button>
        <button className="bg-gray-100 px-4 py-1 rounded-full text-sm whitespace-nowrap">
          Architecture
        </button>
        <button className="bg-gray-100 px-4 py-1 rounded-full text-sm whitespace-nowrap">
          Food
        </button>
        <button className="bg-gray-100 px-4 py-1 rounded-full text-sm whitespace-nowrap">
          Nature
        </button>
        <button className="bg-gray-100 px-4 py-1 rounded-full text-sm whitespace-nowrap">
          Art
        </button>
        <button className="bg-gray-100 px-4 py-1 rounded-full text-sm whitespace-nowrap">
          Music
        </button>
      </div>

      {/* Explore Grid */}
      <div className="grid grid-cols-3 gap-1 pb-16">
        {EXPLORE_POSTS.map((post) => (
          <div key={post.id} className="relative aspect-square">
            <img
              src={post.image}
              alt={`Explore ${post.id}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex items-center text-white mr-3">
                <Heart className="h-5 w-5 mr-1 fill-white" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center text-white">
                <MessageCircle className="h-5 w-5 mr-1 fill-white" />
                <span>{post.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;