// src/pages/Login.jsx — Neural Dark redesign
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const NeuralLogo = () => (
  <motion.div className="relative w-20 h-20 mx-auto mb-6"
    animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
    {/* Outer ring */}
    <div className="absolute inset-0 rounded-full border border-cyan-500/30" />
    <motion.div className="absolute inset-0 rounded-full border border-cyan-500/60"
      style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
      animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
    {/* Inner core */}
    <div className="absolute inset-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center glow-cyan">
      <motion.div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500"
        animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
    </div>
    {/* Orbit dot */}
    <motion.div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ boxShadow: '0 0 10px #00CFFF' }}
      animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      style={{ transformOrigin: '50% 40px' }} />
  </motion.div>
);

const InputField = ({ label, type, name, value, onChange, placeholder, icon }) => (
  <div className="space-y-2">
    <label className="block text-xs font-semibold text-ink-300 uppercase tracking-widest">{label}</label>
    <div className="relative group">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-cyan-400 transition-colors text-base">
        {icon}
      </span>
      <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full bg-void-800/60 border border-void-600 group-focus-within:border-cyan-500/50 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-ink-100 placeholder-ink-500 outline-none transition-all duration-300"
        style={{ backdropFilter: 'blur(10px)' }} />
      <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300"
        style={{ boxShadow: '0 0 0 1px rgba(0,207,255,0.3), 0 0 20px rgba(0,207,255,0.08)' }} />
    </div>
  </div>
);

export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Fill in all fields');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back to ARIA');
      navigate('/chat');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#02040A' }}>
      {/* Aurora background */}
      <div className="aurora-bg">
        <div className="aurora-orb aurora-1" />
        <div className="aurora-orb aurora-2" />
        <div className="aurora-orb aurora-3" />
      </div>
      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan-400"
          style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%`, boxShadow: '0 0 6px #00CFFF' }}
          animate={{ y: [-10, 10, -10], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }} />
      ))}

      <motion.div className="relative z-10 w-full max-w-md px-4 page-enter">
        {/* Logo */}
        <div className="text-center mb-8">
          <NeuralLogo />
          <motion.h1 className="font-display text-4xl font-extrabold grad-text glow-text-cyan mb-2"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            ARIA
          </motion.h1>
          <motion.p className="text-ink-400 text-sm tracking-wider"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            NEURAL AI ASSISTANT
          </motion.p>
        </div>

        {/* Card */}
        <motion.div className="glass-strong rounded-3xl p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

          <h2 className="font-display text-xl font-bold text-ink-100 mb-1">Welcome back</h2>
          <p className="text-ink-400 text-sm mb-7">Sign in to continue your neural sessions</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField label="Email" type="email" name="email" value={form.email} onChange={onChange}
              placeholder="you@example.com" icon="✉" />
            <InputField label="Password" type="password" name="password" value={form.password} onChange={onChange}
              placeholder="••••••••" icon="🔒" />

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full relative overflow-hidden rounded-2xl py-3.5 text-sm font-bold text-white transition-all duration-300 mt-2 btn-lift"
              style={{ background: 'linear-gradient(135deg, #00CFFF, #6E3FFF)', boxShadow: '0 0 30px rgba(0,207,255,0.3)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In to ARIA →
                </span>
              )}
              {/* Shimmer sweep */}
              <motion.div className="absolute inset-0 opacity-0 hover:opacity-100"
                style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)' }}
                animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }} />
            </motion.button>
          </form>

          <p className="text-center text-ink-400 text-sm mt-6">
            No account?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors glow-text-cyan">
              Create one free
            </Link>
          </p>
        </motion.div>

        {/* Bottom tag */}
        <motion.p className="text-center text-ink-500 text-xs mt-6 tracking-widest"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          POWERED BY LLAMA 3.3 · 100% FREE
        </motion.p>
      </motion.div>
    </div>
  );
}
