// src/components/InputBar.jsx — Neural Dark redesign
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import toast from 'react-hot-toast';

const TOOLS = [
  { id: 'chat',      icon: '💬', label: 'Chat',      color: '#00CFFF', desc: 'General conversation' },
  { id: 'summarize', icon: '📄', label: 'Summarize', color: '#8F72FF', desc: 'Condense into key points' },
  { id: 'code',      icon: '💻', label: 'Code',      color: '#22E5FF', desc: 'Write & explain code' },
  { id: 'qa',        icon: '❓', label: 'Q&A',       color: '#FF5593', desc: 'Precise answers' },
];

export default function InputBar({ onSend, disabled }) {
  const [text, setText]           = useState('');
  const [tool, setTool]           = useState('chat');
  const [showTools, setShowTools] = useState(false);
  const [file, setFile]           = useState(null);
  const [uploading, setUploading] = useState(false);
  const [listening, setListening] = useState(false);
  const textareaRef  = useRef(null);
  const fileInputRef = useRef(null);
  const recRef       = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim(), tool, file);
    setText(''); setFile(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleFile = async e => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', f);
    try {
      const { data } = await api.post('/files/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFile({ name: data.file.originalName, url: data.file.url, text: data.extractedText || '' });
      toast.success('File attached!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const toggleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return toast.error('Speech not supported in this browser');
    if (listening) { recRef.current?.stop(); setListening(false); return; }
    const r = new SR();
    r.lang = 'en-US'; r.continuous = false; r.interimResults = false;
    r.onstart  = () => setListening(true);
    r.onresult = e => setText(p => p ? p + ' ' + e.results[0][0].transcript : e.results[0][0].transcript);
    r.onerror  = () => { setListening(false); toast.error('Mic error'); };
    r.onend    = () => setListening(false);
    recRef.current = r; r.start();
  };

  const activeTool = TOOLS.find(t => t.id === tool);

  return (
    <div className="px-4 pb-5 pt-2">
      {/* File chip */}
      <AnimatePresence>
        {file && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
            className="flex items-center gap-2 mb-2.5 px-3 py-2 rounded-xl w-fit"
            style={{ background: 'rgba(0,207,255,0.06)', border: '1px solid rgba(0,207,255,0.15)' }}>
            <span className="text-cyan-400 text-sm">📎</span>
            <span className="text-xs text-ink-300 truncate max-w-[200px]">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-ink-500 hover:text-pink-400 text-xs ml-1 transition-colors">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tool + controls row */}
      <div className="flex items-center gap-2 mb-2.5">
        {/* Tool selector */}
        <div className="relative">
          <button onClick={() => setShowTools(v => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{ background: 'rgba(13,21,37,0.9)', border: `1px solid ${activeTool.color}30`, color: activeTool.color }}>
            <span>{activeTool.icon}</span>
            <span>{activeTool.label}</span>
            <motion.span className="text-ink-500 text-[10px]" animate={{ rotate: showTools ? 180 : 0 }}>▾</motion.span>
          </button>
          <AnimatePresence>
            {showTools && (
              <motion.div initial={{ opacity: 0, y: 6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }} transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 mb-2 rounded-2xl overflow-hidden z-20 min-w-[200px]"
                style={{ background: '#080D1A', border: '1px solid rgba(0,207,255,0.12)', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}>
                {TOOLS.map(t => (
                  <button key={t.id} onClick={() => { setTool(t.id); setShowTools(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-white/5"
                    style={{ borderLeft: tool === t.id ? `2px solid ${t.color}` : '2px solid transparent' }}>
                    <span className="text-base">{t.icon}</span>
                    <div>
                      <div className="text-xs font-semibold" style={{ color: t.color }}>{t.label}</div>
                      <div className="text-[10px] text-ink-500">{t.desc}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hints */}
        <span className="text-[10px] text-ink-600 ml-auto">Enter to send · Shift+Enter for new line</span>
      </div>

      {/* Main input */}
      <div className="relative rounded-3xl transition-all duration-300 input-glow"
        style={{ background: 'rgba(8,13,26,0.9)', border: '1px solid rgba(0,207,255,0.1)' }}>
        {/* Top highlight */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent rounded-full" />

        <div className="flex items-end gap-2 px-4 pt-3 pb-2">
          <textarea ref={textareaRef} value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={listening ? '🎙️ Listening...' : `Ask ARIA anything…`}
            disabled={disabled} rows={1}
            className="flex-1 bg-transparent text-sm text-ink-100 placeholder-ink-500 resize-none outline-none leading-relaxed py-1 max-h-40 font-body" />
        </div>

        {/* Bottom action row */}
        <div className="flex items-center gap-1 px-3 pb-3">
          {/* File */}
          <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => fileInputRef.current?.click()} disabled={uploading}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-ink-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all text-sm"
            data-tip="Attach file">
            {uploading ? <div className="w-3.5 h-3.5 border-2 border-ink-600 border-t-cyan-400 rounded-full animate-spin" /> : '📎'}
          </motion.button>

          {/* Mic */}
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={toggleMic}
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-all ${listening ? 'text-pink-400 bg-pink-500/15 animate-pulse' : 'text-ink-500 hover:text-cyan-400 hover:bg-cyan-500/10'}`}
            data-tip={listening ? 'Stop' : 'Voice input'}>
            {listening ? '🎙️' : '🎤'}
          </motion.button>

          {/* Thinking indicator */}
          {disabled && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 ml-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ boxShadow: '0 0 6px #00CFFF' }} />
              <span className="text-[10px] text-cyan-400 font-mono tracking-wider">ARIA IS THINKING</span>
            </motion.div>
          )}

          {/* Send button */}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
            onClick={handleSend} disabled={!text.trim() || disabled}
            className="ml-auto w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold transition-all relative overflow-hidden"
            style={text.trim() && !disabled
              ? { background: 'linear-gradient(135deg, #00CFFF, #6E3FFF)', boxShadow: '0 0 20px rgba(0,207,255,0.4)' }
              : { background: 'rgba(13,21,37,0.8)', color: '#3A4D65' }}>
            <span className="text-sm">→</span>
            {text.trim() && !disabled && (
              <motion.div className="absolute inset-0 opacity-0 hover:opacity-30 pointer-events-none"
                style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.3), transparent)' }} />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
