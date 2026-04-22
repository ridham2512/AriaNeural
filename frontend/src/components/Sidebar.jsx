// src/components/Sidebar.jsx — Neural Dark redesign
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Sidebar({ chats, activeChat, loading, createChat, openChat, deleteChat, renameChat, onCloseMobile }) {
  const { user, logout } = useAuth();
  const [search, setSearch]   = useState('');
  const [hovered, setHovered] = useState(null);
  const [renaming, setRenaming] = useState(null);
  const [renameVal, setRenameVal] = useState('');
  const [showMenu, setShowMenu]   = useState(false);

  const filtered = chats.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  const submitRename = async id => {
    if (renameVal.trim()) await renameChat(id, renameVal.trim());
    setRenaming(null); setRenameVal('');
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden"
      style={{ background: 'rgba(5, 8, 16, 0.97)', borderRight: '1px solid rgba(0,207,255,0.07)' }}>

      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* ── Header ─────────────────────────────── */}
      <div className="relative p-4 pb-3">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-4 px-1">
          <motion.div className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(0,207,255,0.2), rgba(110,63,255,0.25))', border: '1px solid rgba(0,207,255,0.3)' }}
            animate={{ boxShadow: ['0 0 10px rgba(0,207,255,0.2)', '0 0 25px rgba(0,207,255,0.5)', '0 0 10px rgba(0,207,255,0.2)'] }}
            transition={{ duration: 3, repeat: Infinity }}>
            <span className="text-base">⚡</span>
          </motion.div>
          <div>
            <span className="font-display font-extrabold text-lg grad-text-cyan tracking-wide">ARIA</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 5px #34d399' }} />
              <span className="text-[10px] text-ink-400 tracking-widest">ONLINE</span>
            </div>
          </div>
        </div>

        {/* New chat button */}
        <motion.button onClick={() => { createChat(); onCloseMobile?.(); }}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-semibold text-white relative overflow-hidden btn-lift"
          style={{ background: 'linear-gradient(135deg, rgba(0,207,255,0.15), rgba(110,63,255,0.15))', border: '1px solid rgba(0,207,255,0.25)' }}>
          <span className="text-cyan-400 text-lg leading-none">+</span>
          <span className="text-ink-200">New conversation</span>
          {/* sweep shine */}
          <motion.div className="absolute inset-0 opacity-0 hover:opacity-100 pointer-events-none"
            style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(0,207,255,0.06) 50%, transparent 60%)' }} />
        </motion.button>
      </div>

      {/* ── Search ─────────────────────────────── */}
      <div className="px-3 pb-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 text-xs">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chats..."
            className="w-full text-xs py-2.5 pl-8 pr-3 rounded-xl outline-none text-ink-200 placeholder-ink-500 transition-all"
            style={{ background: 'rgba(13,21,37,0.8)', border: '1px solid rgba(0,207,255,0.08)' }} />
        </div>
      </div>

      {/* ── Chat list label ─────────────────────── */}
      <div className="px-4 py-1.5">
        <span className="text-[10px] font-semibold text-ink-500 uppercase tracking-widest">Recent Chats</span>
      </div>

      {/* ── Chat list ───────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-0.5">
        {loading && chats.length === 0 ? (
          <div className="space-y-2 px-2 py-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 rounded-xl shimmer" style={{ opacity: 1 - i * 0.15 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-3xl mb-2">💬</div>
            <p className="text-xs text-ink-500">{search ? 'No results' : 'No chats yet'}</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filtered.map((chat, i) => {
              const isActive = activeChat?._id === chat._id;
              return (
                <motion.div key={chat._id}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2, delay: i * 0.03 }}
                  className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer chat-item ${isActive ? 'active' : ''}`}
                  onClick={() => { openChat(chat); onCloseMobile?.(); }}
                  onMouseEnter={() => setHovered(chat._id)}
                  onMouseLeave={() => setHovered(null)}>
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div layoutId="activeBar"
                      className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                      style={{ background: 'linear-gradient(to bottom, #00CFFF, #6E3FFF)' }} />
                  )}

                  <span className={`text-sm flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-ink-500'}`}>
                    {chat.isPinned ? '📌' : '💬'}
                  </span>

                  {renaming === chat._id ? (
                    <input autoFocus value={renameVal} onChange={e => setRenameVal(e.target.value)}
                      onBlur={() => submitRename(chat._id)}
                      onKeyDown={e => { if (e.key === 'Enter') submitRename(chat._id); if (e.key === 'Escape') setRenaming(null); }}
                      onClick={e => e.stopPropagation()}
                      className="flex-1 bg-transparent text-xs text-ink-100 outline-none border-b border-cyan-500/50" />
                  ) : (
                    <span className={`flex-1 text-xs truncate ${isActive ? 'text-ink-100 font-medium' : 'text-ink-300'}`}
                      onDoubleClick={e => { e.stopPropagation(); setRenaming(chat._id); setRenameVal(chat.title); }}>
                      {chat.title}
                    </span>
                  )}

                  {/* Delete button */}
                  <AnimatePresence>
                    {(hovered === chat._id || isActive) && (
                      <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                        onClick={e => { e.stopPropagation(); deleteChat(chat._id); }}
                        className="text-ink-500 hover:text-pink-400 transition-colors text-xs p-0.5 flex-shrink-0"
                        data-tip="Delete">
                        🗑
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* ── User section ────────────────────────── */}
      <div className="relative" style={{ borderTop: '1px solid rgba(0,207,255,0.06)' }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="p-3">
          <button onClick={() => setShowMenu(v => !v)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
            style={{ background: showMenu ? 'rgba(0,207,255,0.05)' : 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,207,255,0.04)'}
            onMouseLeave={e => { if (!showMenu) e.currentTarget.style.background = 'transparent'; }}>
            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #00CFFF, #6E3FFF)', boxShadow: '0 0 12px rgba(0,207,255,0.3)' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-semibold text-ink-200 truncate">{user?.name}</p>
              <p className="text-[10px] text-ink-500 truncate">{user?.email}</p>
            </div>
            <motion.span className="text-ink-500 text-xs" animate={{ rotate: showMenu ? 180 : 0 }}>▾</motion.span>
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }} transition={{ duration: 0.15 }}
                className="mt-1 rounded-2xl overflow-hidden"
                style={{ background: '#080D1A', border: '1px solid rgba(0,207,255,0.1)' }}>
                <button className="w-full flex items-center gap-2.5 px-4 py-3 text-xs text-ink-300 hover:bg-white/5 transition-colors">
                  👤 Profile
                </button>
                <button onClick={() => { logout(); toast.success('Logged out'); }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-xs text-pink-400 hover:bg-pink-500/10 transition-colors">
                  🚪 Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
