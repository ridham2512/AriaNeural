// src/pages/Register.jsx — Neural Dark redesign
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const fields = [
  { name: 'name',     label: 'Full Name',       type: 'text',     icon: '👤', placeholder: 'John Doe' },
  { name: 'email',    label: 'Email Address',   type: 'email',    icon: '✉',  placeholder: 'you@example.com' },
  { name: 'password', label: 'Password',        type: 'password', icon: '🔒', placeholder: '••••••••' },
  { name: 'confirm',  label: 'Confirm Password',type: 'password', icon: '🔒', placeholder: '••••••••' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]   = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Fill in all fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Welcome to ARIA! 🎉');
      navigate('/chat');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#02040A' }}>
      <div className="aurora-bg">
        <div className="aurora-orb aurora-1" />
        <div className="aurora-orb aurora-2" />
        <div className="aurora-orb aurora-3" />
      </div>
      <div className="absolute inset-0 grid-bg opacity-40" />

      {[...Array(5)].map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{ width: 4 + i * 2, height: 4 + i * 2, left: `${10 + i * 18}%`, top: `${15 + (i % 4) * 20}%`,
            background: i % 2 === 0 ? '#00CFFF' : '#6E3FFF', boxShadow: `0 0 8px ${i % 2 === 0 ? '#00CFFF' : '#6E3FFF'}` }}
          animate={{ y: [-8, 8, -8], opacity: [0.3, 0.9, 0.3], scale: [1, 1.3, 1] }}
          transition={{ duration: 2.5 + i * 0.6, repeat: Infinity, delay: i * 0.3 }} />
      ))}

      <motion.div className="relative z-10 w-full max-w-md px-4 page-enter">
        <div className="text-center mb-6">
          <motion.div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(0,207,255,0.2), rgba(110,63,255,0.2))', border: '1px solid rgba(0,207,255,0.3)', boxShadow: '0 0 30px rgba(0,207,255,0.2)' }}
            animate={{ boxShadow: ['0 0 20px rgba(0,207,255,0.2)', '0 0 40px rgba(0,207,255,0.4)', '0 0 20px rgba(0,207,255,0.2)'] }}
            transition={{ duration: 3, repeat: Infinity }}>
            <span className="text-2xl">✨</span>
          </motion.div>
          <h1 className="font-display text-3xl font-extrabold grad-text mb-1">Join ARIA</h1>
          <p className="text-ink-400 text-sm tracking-wider">CREATE YOUR FREE NEURAL ACCOUNT</p>
        </div>

        <motion.div className="glass-strong rounded-3xl p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type, icon, placeholder }, i) => (
              <motion.div key={name} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}>
                <label className="block text-xs font-semibold text-ink-300 uppercase tracking-widest mb-2">{label}</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 group-focus-within:text-cyan-400 transition-colors">{icon}</span>
                  <input name={name} type={type} value={form[name]} onChange={onChange} placeholder={placeholder}
                    className="w-full bg-void-800/60 border border-void-600 group-focus-within:border-cyan-500/50 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-ink-100 placeholder-ink-500 outline-none transition-all"
                    style={{ backdropFilter: 'blur(10px)' }} />
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity"
                    style={{ boxShadow: '0 0 0 1px rgba(0,207,255,0.3), 0 0 20px rgba(0,207,255,0.06)' }} />
                </div>
              </motion.div>
            ))}

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              className="w-full relative overflow-hidden rounded-2xl py-3.5 text-sm font-bold text-white mt-2 btn-lift"
              style={{ background: 'linear-gradient(135deg, #6E3FFF, #00CFFF)', boxShadow: '0 0 30px rgba(110,63,255,0.3)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Free Account →'}
            </motion.button>
          </form>

          <p className="text-center text-ink-400 text-sm mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">Sign in</Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
