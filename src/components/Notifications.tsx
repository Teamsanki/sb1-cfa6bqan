import React from 'react';
import { Heart, MessageCircle, UserPlus } from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'like',
    username: 'janedoe',
    userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    content: 'liked your photo',
    time: '2m',
    postImage: 'https://images.unsplash.com/photo-1604537466608-109fa2f16c3b'
  },
  {
    id: 2,
    type: 'follow',
    username: 'traveler',
    userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    content: 'started following you',
    time: '1h'
  },
  {
    id: 3,
    type: 'comment',
    username: 'foodie',
    userImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    content: 'commented: "Amazing shot!"',
    time: '3h',
    postImage: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714'
  },
  {
    id: 4,
    type: 'like',
    username: 'photographer',
    userImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    content: 'liked your photo',
    time: '5h',
    postImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38'
  },
  {
    id: 5,
    type: 'follow',
    username: 'designer',
    userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    content: 'started following you',
    time: '1d'
  },
  {
    id: 6,
    type: 'comment',
    username: 'artist',
    userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    content: 'commented: "Love the composition!"',
    time: '2d',
    postImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f'
  }
];

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'like':
      return <Heart className="h-6 w-6 text-red-500 fill-red-500" />;
    case 'comment':
      return <MessageCircle className="h-6 w-6 text-green-500" />;
    case 'follow':
      return <UserPlus className="h-6 w-6 text-blue-500" />;
    default:
      return null;
  }
};

const Notifications: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <div className="bg-white border border-gray-200 rounded-lg">
        {NOTIFICATIONS.map((notification) => (
          <div
            key={notification.id}
            className="flex items-center p-4 border-b border-gray-100 last:border-b-0"
          >
            <div className="mr-3">
              <img
                src={notification.userImage}
                alt={notification.username}
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p>
                <span className="font-semibold">{notification.username}</span>{' '}
                {notification.content}{' '}
                <span className="text-gray-500 text-sm">{notification.time}</span>
              </p>
            </div>
            <div className="ml-3 flex items-center">
              {notification.type !== 'follow' ? (
                notification.postImage ? (
                  <img
                    src={notification.postImage}
                    alt="Post"
                    className="h-10 w-10 object-cover"
                  />
                ) : null
              ) : (
                <button className="bg-blue-500 text-white text-sm px-3 py-1 rounded">
                  Follow
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;