import React, { useState, useEffect } from 'react';
import { Phone, Video, X } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserStore } from '../../store/userStore';
import SimplePeer from 'simple-peer';
import { io } from 'socket.io-client';

interface CallUser {
  uid: string;
  displayName: string;
  photoURL: string;
}

const Calls: React.FC = () => {
  const { user } = useUserStore();
  const [users, setUsers] = useState<CallUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<CallUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '!=', user.uid));
        const querySnapshot = await getDocs(q);
        
        const usersList: CallUser[] = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          usersList.push({
            uid: userData.uid,
            displayName: userData.displayName,
            photoURL: userData.photoURL
          });
        });
        
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [user]);

  const startCall = async (type: 'audio' | 'video') => {
    if (!selectedUser) return;
    
    // Initialize WebRTC connection
    console.log(`Starting ${type} call with ${selectedUser.displayName}`);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
      {/* Users list */}
      <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Calls</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {users.map((callUser) => (
              <div
                key={callUser.uid}
                className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 ${
                  selectedUser?.uid === callUser.uid ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedUser(callUser)}
              >
                <img
                  src={callUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(callUser.displayName)}`}
                  alt={callUser.displayName}
                  className="h-12 w-12 rounded-full object-cover mr-3"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{callUser.displayName}</h3>
                  <p className="text-sm text-gray-500">Tap to call</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Call interface */}
      {selectedUser && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
              <img
                src={selectedUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.displayName)}`}
                alt={selectedUser.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold">{selectedUser.displayName}</h2>
          </div>
          
          <div className="flex space-x-6">
            <button
              onClick={() => startCall('audio')}
              className="p-4 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              <Phone className="h-8 w-8 text-white" />
            </button>
            
            <button
              onClick={() => startCall('video')}
              className="p-4 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
            >
              <Video className="h-8 w-8 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calls;