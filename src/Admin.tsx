import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User, LogIn, Edit, Save, LogOut, Settings, Camera, Map as MapIcon, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { destinations as defaultDestinations } from './destinations';

export default function Admin() {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('adminToken');
    } catch (e) {
      return null;
    }
  });
  
  if (!token) {
    return <AdminLogin setToken={(t) => {
      try { localStorage.setItem('adminToken', t); } catch (e) {}
      setToken(t);
    }} />;
  }

  return <AdminDashboard token={token} onLogout={() => {
    try { localStorage.removeItem('adminToken'); } catch (e) {}
    setToken(null);
  }} />;
}

function AdminLogin({ setToken }: { setToken: (t: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.trim().toLowerCase();
    const p = password.trim();

    if (!u || !p) {
      setError('Please enter username and password');
      return;
    }

    // 1. Master default check (admin / password OR admin / admin)
    if (u === 'admin' && (p === 'password' || p === 'admin')) {
      try { localStorage.setItem('adminToken', 'static-admin-token'); } catch (e) {}
      setToken('static-admin-token');
      return;
    }

    // 2. Check custom updated credentials saved in localStorage
    try {
      const savedCreds = localStorage.getItem('admin_credentials');
      if (savedCreds) {
        const creds = JSON.parse(savedCreds);
        const validU = (creds.username || 'admin').trim().toLowerCase();
        const validP = (creds.password || 'password').trim();
        if (u === validU && p === validP) {
          try { localStorage.setItem('adminToken', 'static-admin-token'); } catch (e) {}
          setToken('static-admin-token');
          return;
        }
      }
    } catch (e) {}

    // 3. Check server API if running in fullstack mode (with JSON guard)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: p })
      });
      const ct = res.headers.get('content-type');
      if (res.ok && ct && ct.includes('application/json')) {
        const data = await res.json();
        if (data.token) {
          try { localStorage.setItem('adminToken', data.token); } catch (e) {}
          setToken(data.token);
          return;
        }
      }
    } catch (e) {
      // Static host fallback
    }

    setError('Invalid credentials');
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-main flex items-center justify-center relative overflow-hidden p-4">
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-accent/10 blur-[120px] rounded-full pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"
        />
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onSubmit={handleLogin}
        className="w-full max-w-md p-6 sm:p-10 bg-bg-panel/80 backdrop-blur-2xl border border-text-main/10 shadow-2xl relative z-10"
      >
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent/20 shadow-[0_0_30px_rgba(242,125,38,0.2)]"
          >
            <Lock className="w-10 h-10 text-accent" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] mb-2">Admin Access</h1>
          <p className="text-text-main/60 font-sans tracking-widest text-xs uppercase">Secure Portal</p>
        </div>

        <div className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-main/40" />
            <input 
              type="text" 
              placeholder="USERNAME"
              value={username}
              onChange={e => {
                setUsername(e.target.value);
                if (error) setError('');
              }}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="w-full bg-bg-base/50 border border-text-main/20 h-14 pl-12 pr-4 font-sans tracking-widest text-sm focus:border-accent outline-none transition-colors"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-main/40" />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="PASSWORD"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="w-full bg-bg-base/50 border border-text-main/20 h-14 pl-12 pr-12 font-sans tracking-widest text-sm focus:border-accent outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-main/40 hover:text-accent transition-colors"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-xs font-bold tracking-widest uppercase text-center py-1"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "var(--color-accent-hover)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-14 bg-accent text-white font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(242,125,38,0.3)] transition-all mt-2"
            type="submit"
          >
            Enter <LogIn className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}

function AdminDashboard({ token, onLogout }: { token: string, onLogout: () => void }) {
  const [destinations, setDestinations] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('custom_destinations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return defaultDestinations;
  });
  const [view, setView] = useState<'content' | 'settings'>('content');
  const [saving, setSaving] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/destinations')
      .then(res => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDestinations(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveDestinations = async () => {
    setSaving(true);
    // Always save locally
    try {
      localStorage.setItem('custom_destinations', JSON.stringify(destinations));
    } catch (e) {}

    try {
      await fetch('/api/destinations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(destinations)
      });
    } catch (e) {}

    setSaving(false);
    setMessage('Content updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;

    // Always update locally
    try {
      localStorage.setItem('admin_credentials', JSON.stringify({ username: newUsername, password: newPassword }));
    } catch (e) {}

    try {
      await fetch('/api/credentials', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: newUsername, password: newPassword })
      });
    } catch (e) {}

    setMessage('Credentials updated!');
    setNewUsername('');
    setNewPassword('');
    setTimeout(() => setMessage(''), 3000);
  };

  const updateDestination = (index: number, field: string, value: string) => {
    const newDests = [...destinations];
    newDests[index] = { ...newDests[index], [field]: value };
    setDestinations(newDests);
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-main flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-bg-panel border-b md:border-b-0 md:border-r border-text-main/10 flex flex-col">
        <div className="p-8 border-b border-text-main/10">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-accent flex items-center gap-3">
            <Settings className="w-6 h-6" /> Admin
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setView('content')}
            className={`w-full text-left p-4 flex items-center gap-3 font-sans uppercase tracking-widest text-xs font-bold transition-colors ${view === 'content' ? 'bg-text-main/10 text-accent' : 'text-text-main/60 hover:text-text-main hover:bg-text-main/5'}`}
          >
            <MapIcon className="w-4 h-4" /> Edit Content
          </button>
          <button 
            onClick={() => setView('settings')}
            className={`w-full text-left p-4 flex items-center gap-3 font-sans uppercase tracking-widest text-xs font-bold transition-colors ${view === 'settings' ? 'bg-text-main/10 text-accent' : 'text-text-main/60 hover:text-text-main hover:bg-text-main/5'}`}
          >
            <User className="w-4 h-4" /> Credentials
          </button>
        </nav>
        <div className="p-4 border-t border-text-main/10">
          <button 
            onClick={onLogout}
            className="w-full text-left p-4 flex items-center gap-3 font-sans uppercase tracking-widest text-xs font-bold text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-screen overflow-y-auto p-8 md:p-12 relative">
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-8 left-1/2 -translate-x-1/2 bg-accent text-white px-6 py-3 font-bold tracking-widest text-sm uppercase shadow-2xl z-50 flex items-center gap-3"
            >
              <Save className="w-4 h-4" /> {message}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {view === 'content' && (
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-black uppercase tracking-widest">Media Content</h1>
                <button 
                  onClick={handleSaveDestinations}
                  disabled={saving}
                  className="bg-accent text-white px-8 py-4 font-bold tracking-widest uppercase flex items-center gap-3 hover:bg-accent/90 transition-colors disabled:opacity-50"
                >
                  <Save className="w-5 h-5" /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

              <div className="grid gap-8">
                {destinations.map((dest, i) => (
                  <div key={dest.id} className="bg-bg-panel border border-text-main/10 p-8">
                    <h3 className="text-xl font-bold tracking-widest uppercase mb-6 flex items-center gap-3">
                      <MapIcon className="w-6 h-6 text-accent" /> {dest.name}
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-xs font-bold tracking-widest uppercase text-text-main/60 mb-3 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" /> Hero Image / Video URL
                        </label>
                        <input 
                          type="text" 
                          value={dest.heroImage}
                          onChange={e => updateDestination(i, 'heroImage', e.target.value)}
                          className="w-full bg-bg-base border border-text-main/20 p-4 font-sans text-sm focus:border-accent outline-none transition-colors"
                        />
                        {dest.heroImage && (
                          <div className="mt-4 aspect-video bg-bg-base border border-text-main/10 relative overflow-hidden">
                            {dest.heroImage.match(/\.(mp4|webm)$/i) ? (
                              <video src={dest.heroImage} autoPlay muted loop className="w-full h-full object-cover" />
                            ) : (
                              <img src={dest.heroImage} alt="Preview" className="w-full h-full object-cover opacity-80" />
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold tracking-widest uppercase text-text-main/60 mb-3 flex items-center gap-2">
                          <Camera className="w-4 h-4" /> History Image / Video URL
                        </label>
                        <input 
                          type="text" 
                          value={dest.historyImage}
                          onChange={e => updateDestination(i, 'historyImage', e.target.value)}
                          className="w-full bg-bg-base border border-text-main/20 p-4 font-sans text-sm focus:border-accent outline-none transition-colors"
                        />
                        {dest.historyImage && (
                          <div className="mt-4 aspect-video bg-bg-base border border-text-main/10 relative overflow-hidden">
                            {dest.historyImage.match(/\.(mp4|webm)$/i) ? (
                              <video src={dest.historyImage} autoPlay muted loop className="w-full h-full object-cover" />
                            ) : (
                              <img src={dest.historyImage} alt="Preview" className="w-full h-full object-cover opacity-80" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'settings' && (
            <div className="max-w-xl mx-auto">
              <h1 className="text-3xl font-black uppercase tracking-widest mb-10">Admin Credentials</h1>
              <form onSubmit={handleUpdateCredentials} className="bg-bg-panel border border-text-main/10 p-8 space-y-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-text-main/60 mb-3">
                    New Username
                  </label>
                  <input 
                    type="text" 
                    value={newUsername}
                    onChange={e => setNewUsername(e.target.value)}
                    className="w-full bg-bg-base border border-text-main/20 p-4 font-sans text-sm focus:border-accent outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-text-main/60 mb-3">
                    New Password
                  </label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-bg-base border border-text-main/20 p-4 font-sans text-sm focus:border-accent outline-none transition-colors"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-accent text-white px-8 py-4 font-bold tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-accent/90 transition-colors mt-8"
                >
                  <Save className="w-5 h-5" /> Update Credentials
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
