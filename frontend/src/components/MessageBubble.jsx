// src/components/MessageBubble.jsx — Neural Dark redesign
import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ children, language }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(String(children));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative my-3 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,207,255,0.12)' }}>
      <div className="flex items-center justify-between px-4 py-2"
        style={{ background: 'rgba(0,207,255,0.05)', borderBottom: '1px solid rgba(0,207,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {['#FF5F56','#FFBD2E','#27C93F'].map(c => (
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <span className="text-xs text-ink-400 font-mono">{language || 'code'}</span>
        </div>
        <button onClick={copy}
          className="text-xs text-ink-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5 font-mono">
          {copied ? '✓ copied' : '⎘ copy'}
        </button>
      </div>
      <SyntaxHighlighter language={language || 'text'} style={atomDark}
        customStyle={{ margin: 0, borderRadius: 0, background: 'rgba(2,4,10,0.9)', fontSize: '0.8rem', padding: '16px' }}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
};

export const TypingIndicator = () => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    className="flex gap-3 items-start">
    <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, rgba(0,207,255,0.2), rgba(110,63,255,0.25))', border: '1px solid rgba(0,207,255,0.3)', boxShadow: '0 0 15px rgba(0,207,255,0.2)' }}>
      <span className="text-sm">⚡</span>
    </div>
    <div className="rounded-3xl rounded-tl-lg px-5 py-4 flex items-center gap-2"
      style={{ background: 'rgba(8,13,26,0.9)', border: '1px solid rgba(0,207,255,0.1)' }}>
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
    </div>
  </motion.div>
);

const TOOL_BADGES = { summarize: { label: 'Summary', color: '#8F72FF' }, code: { label: 'Code', color: '#00CFFF' }, qa: { label: 'Q&A', color: '#FF5593' } };

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const badge = TOOL_BADGES[message.tool];

  const copyMsg = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className={`flex gap-3 items-start group ${isUser ? 'flex-row-reverse' : ''} mb-5`}>

      {/* Avatar */}
      <motion.div whileHover={{ scale: 1.08 }}
        className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={isUser
          ? { background: 'linear-gradient(135deg, #253347, #1c2840)', border: '1px solid rgba(255,255,255,0.08)' }
          : { background: 'linear-gradient(135deg, rgba(0,207,255,0.2), rgba(110,63,255,0.25))', border: '1px solid rgba(0,207,255,0.35)', boxShadow: '0 0 16px rgba(0,207,255,0.2)' }}>
        <span className="text-sm">{isUser ? '👤' : '⚡'}</span>
      </motion.div>

      {/* Bubble */}
      <div className={`max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="rounded-3xl px-5 py-3.5 relative overflow-hidden"
          style={isUser
            ? { background: 'linear-gradient(135deg, rgba(0,207,255,0.18), rgba(110,63,255,0.2))', border: '1px solid rgba(0,207,255,0.25)', borderTopRightRadius: 8, boxShadow: '0 4px 24px rgba(0,207,255,0.08)' }
            : { background: 'rgba(8,13,26,0.95)', border: '1px solid rgba(0,207,255,0.08)', borderTopLeftRadius: 8, boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>

          {/* Shimmer on user bubble */}
          {isUser && (
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(0,207,255,0.08) 50%, transparent 70%)' }} />
          )}

          {isUser ? (
            <p className="text-sm text-ink-100 leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="msg-prose">
              <ReactMarkdown
                components={{
                  code({ inline, className, children }) {
                    const lang = /language-(\w+)/.exec(className || '')?.[1];
                    return !inline
                      ? <CodeBlock language={lang}>{children}</CodeBlock>
                      : <code className="bg-void-700/80 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono border border-cyan-500/15">{children}</code>;
                  },
                  p: ({ children }) => <p className="text-sm text-ink-200 leading-relaxed my-1.5">{children}</p>,
                  strong: ({ children }) => <strong className="text-ink-50 font-semibold">{children}</strong>,
                  li: ({ children }) => (
                    <li className="flex items-start gap-2 text-sm text-ink-300 my-1">
                      <span className="text-cyan-500 mt-1.5 text-xs flex-shrink-0">▸</span>
                      <span>{children}</span>
                    </li>
                  ),
                  ul: ({ children }) => <ul className="my-2 space-y-0.5">{children}</ul>,
                  ol: ({ children }) => <ol className="my-2 space-y-0.5 list-decimal list-inside">{children}</ol>,
                  h1: ({ children }) => <h1 className="font-display text-lg font-bold text-ink-50 mt-3 mb-1.5">{children}</h1>,
                  h2: ({ children }) => <h2 className="font-display text-base font-bold text-ink-100 mt-3 mb-1.5">{children}</h2>,
                  h3: ({ children }) => <h3 className="font-display text-sm font-semibold text-ink-100 mt-2 mb-1">{children}</h3>,
                }}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Meta row */}
        <div className={`flex items-center gap-2 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-all duration-200 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-[10px] text-ink-500 font-mono">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!isUser && (
            <button onClick={copyMsg} className="text-[10px] text-ink-500 hover:text-cyan-400 transition-colors flex items-center gap-1">
              {copied ? '✓ copied' : '⎘'}
            </button>
          )}
          {badge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${badge.color}18`, color: badge.color, border: `1px solid ${badge.color}30` }}>
              {badge.label}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
