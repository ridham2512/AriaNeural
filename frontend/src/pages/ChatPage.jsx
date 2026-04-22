// src/pages/ChatPage.jsx — Neural Dark redesign
import { useEffect, useState } from 'react';
import { useChat } from '../hooks/useChat';
import Sidebar    from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const chat = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => { chat.fetchChats(); }, []);
  useEffect(() => { if (window.innerWidth < 768) setSidebarOpen(false); }, []);

  return (
    <div className="h-screen w-screen flex overflow-hidden relative" style={{ background: '#02040A' }}>
      {/* Global aurora background */}
      <div className="aurora-bg">
        <div className="aurora-orb aurora-1" />
        <div className="aurora-orb aurora-2" />
        <div className="aurora-orb aurora-3" />
      </div>
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div className="fixed inset-0 z-20 md:hidden"
            style={{ background: 'rgba(2,4,10,0.7)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside className="fixed md:relative z-30 md:z-auto h-full w-72 flex-shrink-0"
            initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}>
            <Sidebar {...chat} onCloseMobile={() => setSidebarOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Sidebar toggle */}
        <motion.button onClick={() => setSidebarOpen(v => !v)}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          className="absolute top-3.5 left-4 z-20 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          style={{ background: 'rgba(8,13,26,0.8)', border: '1px solid rgba(0,207,255,0.1)' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,207,255,0.35)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,207,255,0.1)'}>
          <motion.span className="text-ink-400 text-sm"
            animate={{ rotate: sidebarOpen ? 0 : 180 }}>
            {sidebarOpen ? '✕' : '☰'}
          </motion.span>
        </motion.button>

        <ChatWindow {...chat} />
      </main>
    </div>
  );
}
