import React from 'react';
import { Plus } from 'lucide-react';

interface StoryProps {
  story: {
    id: number;
    username: string;
    userImage: string;
    isYours?: boolean;
  };
}

const Story: React.FC<StoryProps> = ({ story }) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${story.isYours ? '' : 'bg-gradient-to-tr from-yellow-400 to-pink-500 p-0.5 rounded-full'}`}>
        <div className="bg-white p-0.5 rounded-full">
          <div className="relative h-14 w-14 rounded-full overflow-hidden">
            <img
              src={story.userImage}
              alt={story.username}
              className="h-full w-full object-cover"
            />
            {story.isYours && (
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                <Plus className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
      <span className="text-xs mt-1 truncate w-16 text-center">
        {story.isYours ? 'Your story' : story.username}
      </span>
    </div>
  );
};

export default Story;