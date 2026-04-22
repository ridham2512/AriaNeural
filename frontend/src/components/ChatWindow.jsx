// src/components/ChatWindow.jsx — Neural Dark redesign
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble, { TypingIndicator } from './MessageBubble';
import InputBar from './InputBar';
import { useAuth } from '../context/AuthContext';

const WelcomeScreen = ({ onNewChat }) => {
  const { user } = useAuth();
  const suggestions = [
    { icon: '⚡', label: 'Generate code',    prompt: 'Write a React custom hook for local storage', tool: 'code',      color: '#00CFFF' },
    { icon: '📄', label: 'Summarize text',   prompt: 'Summarize the key concepts of machine learning', tool: 'summarize', color: '#8F72FF' },
    { icon: '❓', label: 'Answer questions', prompt: 'What is the difference between SQL and NoSQL?',  tool: 'qa',        color: '#FF5593' },
    { icon: '💬', label: 'Just chat',        prompt: 'Tell me something interesting about space',     tool: 'chat',      color: '#22E5FF' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      {/* Animated orb */}
      <motion.div className="relative mb-8"
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}>
        {/* Outer rings */}
        {[72, 56, 44].map((size, i) => (
          <motion.div key={i} className="absolute rounded-full border border-cyan-500/20 top-1/2 left-1/2"
            style={{ width: size, height: size, marginTop: -size/2, marginLeft: -size/2 }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, delay: i * 0.3 }} />
        ))}
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center relative z-10"
          style={{ background: 'linear-gradient(135deg, rgba(0,207,255,0.15), rgba(110,63,255,0.2))', border: '1px solid rgba(0,207,255,0.3)', boxShadow: '0 0 40px rgba(0,207,255,0.2)' }}>
          <motion.span className="text-4xl"
            animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}>⚡</motion.span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-display text-3xl font-extrabold text-ink-50 mb-2">
          Hello, <span className="grad-text">{user?.name?.split(' ')[0] || 'there'}</span> 👋
        </h2>
        <p className="text-ink-400 text-sm mb-8 max-w-sm leading-relaxed">
          I'm ARIA, your neural AI assistant. Ask me anything — code, summaries, questions, or just chat.
        </p>
      </motion.div>

      {/* Suggestion cards */}
      <motion.div className="grid grid-cols-2 gap-3 w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        {suggestions.map(({ icon, label, prompt, tool, color }, i) => (
          <motion.button key={label} onClick={() => onNewChat(prompt, tool)}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
            className="relative text-left p-4 rounded-2xl overflow-hidden group transition-all"
            style={{ background: 'rgba(8,13,26,0.8)', border: `1px solid ${color}20` }}>
            {/* Hover gradient */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
              style={{ background: `radial-gradient(circle at top left, ${color}0D, transparent 70%)` }} />
            <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }} />
            <span className="text-2xl mb-2 block">{icon}</span>
            <p className="text-sm font-semibold text-ink-200 mb-1 relative z-10">{label}</p>
            <p className="text-[11px] text-ink-500 line-clamp-2 relative z-10">{prompt}</p>
          </motion.button>
        ))}
      </motion.div>

      {/* Bottom stats */}
      <motion.div className="flex items-center gap-6 mt-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        {[['⚡', 'Llama 3.3'], ['🆓', '100% Free'], ['🔐', 'Private']].map(([icon, label]) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="text-sm">{icon}</span>
            <span className="text-[11px] text-ink-500 font-medium">{label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function ChatWindow({ activeChat, messages, loading, sending, sendMessage, createChat }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSuggestion = async (prompt, tool) => {
    const chat = await createChat();
    if (chat) setTimeout(() => sendMessage(prompt, tool), 150);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      {/* ── Chat header ─────────────────────── */}
      <AnimatePresence mode="wait">
        {activeChat && (
          <motion.div key={activeChat._id}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-6 py-3.5 pl-14 flex-shrink-0 relative"
            style={{ borderBottom: '1px solid rgba(0,207,255,0.06)' }}>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(0,207,255,0.08)', border: '1px solid rgba(0,207,255,0.15)' }}>
              <span className="text-sm">💬</span>
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold text-ink-100">{activeChat.title}</h3>
              <p className="text-[10px] text-ink-500 font-mono">{messages.length} messages · {activeChat.model || 'llama-3.3'}</p>
            </div>

            {/* Live indicator */}
            {sending && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{ background: 'rgba(0,207,255,0.08)', border: '1px solid rgba(0,207,255,0.2)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ boxShadow: '0 0 5px #00CFFF' }} />
                <span className="text-[10px] text-cyan-400 font-mono tracking-wider">GENERATING</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Messages ─────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6" style={{ scrollBehavior: 'smooth' }}>
        {!activeChat ? (
          <WelcomeScreen onNewChat={handleSuggestion} />
        ) : loading && messages.length === 0 ? (
          <div className="flex flex-col gap-5 py-8 max-w-3xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`flex gap-3 ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                <div className="w-9 h-9 rounded-2xl shimmer flex-shrink-0" />
                <div className="rounded-3xl shimmer" style={{ width: `${35 + Math.random() * 30}%`, height: 56 }} />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-16 text-center">
            <div>
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="text-4xl mb-3">💬</motion.div>
              <p className="text-sm text-ink-500">Send a message to begin</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col py-6 max-w-3xl mx-auto w-full">
            <AnimatePresence initial={false}>
              {messages.map(msg => <MessageBubble key={msg._id} message={msg} />)}
            </AnimatePresence>
            {sending && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* ── Input ────────────────────────────── */}
      <div className="flex-shrink-0 relative"
        style={{ borderTop: '1px solid rgba(0,207,255,0.06)' }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/15 to-transparent" />
        <div className="max-w-3xl mx-auto w-full">
          <InputBar onSend={(c, t, f) => sendMessage(c, t, f)} disabled={sending || !activeChat} />
        </div>
      </div>
    </div>
  );
}
