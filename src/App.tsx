import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Explore from './components/Explore';
import CreatePost from './components/CreatePost';
import Notifications from './components/Notifications';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Chat from './components/chat/Chat';
import Calls from './components/calls/Calls';
import Reels from './components/Reels';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import { useUserStore } from './store/userStore';

function App() {
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUserStore();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email || '',
          displayName: currentUser.displayName || '',
          photoURL: currentUser.photoURL || '',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {user && <Header />}
        
        <main className="flex-1 max-w-5xl mx-auto w-full py-4 px-4 pb-20">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
            
            <Route path="/" element={user ? <Feed /> : <Navigate to="/login" />} />
            <Route path="/explore" element={user ? <Explore /> : <Navigate to="/login" />} />
            <Route path="/create" element={user ? <CreatePost /> : <Navigate to="/login" />} />
            <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
            <Route path="/calls" element={user ? <Calls /> : <Navigate to="/login" />} />
            <Route path="/reels" element={user ? <Reels /> : <Navigate to="/login" />} />
          </Routes>
        </main>
        
        {user && <BottomNav />}
      </div>
    </Router>
  );
}

export default App;