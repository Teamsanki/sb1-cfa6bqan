import React, { useState, useEffect, useRef } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUserStore } from '../../store/userStore';
import { Send, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: any;
}

interface ChatUser {
  uid: string;
  displayName: string;
  photoURL: string;
}

const Chat: React.FC = () => {
  const { user } = useUserStore();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '!=', user.uid));
      
      const querySnapshot = await getDocs(q);
      const usersList: ChatUser[] = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        usersList.push({
          uid: userData.uid,
          displayName: userData.displayName,
          photoURL: userData.photoURL
        });
      });
      
      setUsers(usersList);
    };
    
    fetchUsers();
  }, [user]);

  // Fetch messages when a user is selected
  useEffect(() => {
    if (!user || !selectedUser) return;
    
    const chatId = [user.uid, selectedUser.uid].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesList: ChatMessage[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        messagesList.push({
          id: doc.id,
          senderId: data.senderId,
          receiverId: data.receiverId,
          text: data.text,
          timestamp: data.timestamp
        });
      });
      
      setMessages(messagesList);
      scrollToBottom();
    });
    
    return () => unsubscribe();
  }, [user, selectedUser]);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedUser || !newMessage.trim()) return;
    
    const chatId = [user.uid, selectedUser.uid].sort().join('_');
    
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      senderId: user.uid,
      receiverId: selectedUser.uid,
      text: newMessage,
      timestamp: serverTimestamp()
    });
    
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
      {/* Users list */}
      <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {users.map((chatUser) => (
            <div
              key={chatUser.uid}
              className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 ${
                selectedUser?.uid === chatUser.uid ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedUser(chatUser)}
            >
              <img
                src={chatUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(chatUser.displayName)}`}
                alt={chatUser.displayName}
                className="h-12 w-12 rounded-full object-cover mr-3"
              />
              <div className="flex-1">
                <h3 className="font-medium">{chatUser.displayName}</h3>
                <p className="text-sm text-gray-500">Tap to chat</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={selectedUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.displayName)}`}
                  alt={selectedUser.displayName}
                  className="h-10 w-10 rounded-full object-cover mr-3"
                />
                <h3 className="font-medium">{selectedUser.displayName}</h3>
              </div>
              <Link to="/calls" className="text-blue-500 hover:text-blue-600">
                <Phone className="h-5 w-5" />
              </Link>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.senderId === user?.uid ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.senderId === user?.uid
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === user?.uid ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp ? new Date(message.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-700 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a user from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;