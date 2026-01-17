
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Camera from './pages/Camera';
import Reply from './pages/Reply';
import Settings from './pages/Settings';
import WowliSpace from './pages/WowliSpace';
import WidgetGuide from './pages/WidgetGuide'; // 新增
import { User, WowliState, PhotoMessage } from './types';
import { MOCK_HISTORY } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [wowli, setWowli] = useState<WowliState>({
    hunger: 72,
    streak: 12,
    level: 12,
    mood: 'happy'
  });
  const [history, setHistory] = useState<PhotoMessage[]>(MOCK_HISTORY);

  useEffect(() => {
    const timer = setInterval(() => {
      setWowli(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 1)
      }));
    }, 1000 * 60 * 10);
    return () => clearInterval(timer);
  }, []);

  const handlePostPhoto = (imageUrl: string, caption: string) => {
    const newMsg: PhotoMessage = {
      id: Date.now().toString(),
      senderId: user?.id || 'daughter_id',
      imageUrl,
      caption,
      timestamp: new Date().toISOString(),
      stickers: []
    };
    setHistory([newMsg, ...history]);
    setWowli(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + 30) }));
  };

  const handleReply = (msgId: string, replyText: string) => {
    setHistory(prev => prev.map(m => m.id === msgId ? { ...m, reply: replyText } : m));
    setWowli(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + 20) }));
  };

  return (
    <Router>
      <div className="max-w-[480px] mx-auto min-h-screen bg-background-light dark:bg-background-dark relative shadow-xl overflow-x-hidden">
        <Routes>
          <Route path="/" element={user ? <Home user={user} wowli={wowli} history={history} /> : <Onboarding onComplete={setUser} />} />
          <Route path="/home" element={<Home user={user!} wowli={wowli} history={history} />} />
          <Route path="/camera" element={<Camera onPost={handlePostPhoto} />} />
          <Route path="/reply/:id" element={<Reply history={history} onReply={handleReply} />} />
          <Route path="/space" element={<WowliSpace wowli={wowli} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/widgets" element={<WidgetGuide wowli={wowli} history={history} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
