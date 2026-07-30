import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Terminal, Lock, KeyRound, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AdminLoginProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onClose }) => {
  const [username, setUsername] = useState<string>('admin');
  const [passcode, setPasscode] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = passcode.trim();

    if (!cleanPass) {
      setError(t('admin.passcode', 'Please enter the administrative passcode.'));
      return;
    }

    // Validate credentials against system admin keys
    if (
      (cleanUser === 'admin' || cleanUser === 'administrator' || cleanUser === 'staff') &&
      (cleanPass.toLowerCase() === 'admin' || cleanPass === 'apex2026' || cleanPass === '1234' || cleanPass === 'secret')
    ) {
      // Generate simulated JWT session token
      const token = `adm_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      if (rememberMe) {
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_token', token);
      }
      sessionStorage.setItem('admin_authenticated', 'true');
      sessionStorage.setItem('admin_token', token);

      // Trigger storage event so AdminGuard updates instantly across tabs/views
      window.dispatchEvent(new Event('storage'));

      setError(null);
      setIsSuccess(true);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 600);
    } else {
      setError('AUTHENTICATION FAILED: Invalid Administrator Credentials.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-bg-panel border border-accent/40 w-full max-w-md p-8 shadow-2xl space-y-6 relative rounded-none"
      >
        {onClose && (
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 text-text-main/60 hover:text-accent transition-colors cursor-pointer"
            title={t('common.close', 'Close')}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center mx-auto text-accent mb-3 shadow-[0_0_20px_rgba(242,125,38,0.25)]">
            {isSuccess ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-bounce" />
            ) : (
              <ShieldAlert className="w-7 h-7 animate-pulse" />
            )}
          </div>
          <h2 className="text-xl font-bold font-mono uppercase tracking-widest text-text-main">
            {t('admin.title', 'Restricted Admin Portal')}
          </h2>
          <p className="text-xs text-text-main/70 font-sans leading-relaxed">
            Protected Staff Authentication Gate. Access requires valid credentials to verify session token before unlocking system parameters.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-emerald-500/10 border border-emerald-500/40 p-4 text-center space-y-2">
            <p className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              ✓ AUTHENTICATION SUCCESSFUL
            </p>
            <p className="text-[11px] font-mono text-text-main/70">
              Session token issued. Unlocking administrative dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div>
              <label className="block text-[10px] font-mono uppercase text-accent font-bold mb-1.5 tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3 h-3" />
                Administrator ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(null);
                }}
                placeholder="Admin username..."
                className="w-full bg-bg-base border border-text-main/20 px-4 py-2.5 text-sm text-text-main outline-none focus:border-accent font-mono transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-accent font-bold mb-1.5 tracking-wider flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                {t('admin.passcode', 'Security Passcode / Secret Token')}
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError(null);
                }}
                placeholder="Enter passcode..."
                className="w-full bg-bg-base border border-text-main/20 px-4 py-2.5 text-sm text-text-main outline-none focus:border-accent font-mono transition-colors"
                autoFocus
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-text-main/70">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-accent w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-[11px]">Remember Session Token</span>
              </label>
            </div>

            {error && (
              <div className="text-xs font-mono text-red-500 font-bold bg-red-500/10 p-3 border border-red-500/30 text-center uppercase tracking-wider">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-accent text-bg-base font-mono text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <Terminal className="w-4 h-4" />
              <span>{t('admin.login', 'Authenticate & Issue Token')}</span>
            </button>
          </form>
        )}

        <div className="text-center border-t border-text-main/10 pt-4 space-y-1">
          <span className="text-[10px] font-mono text-text-main/50 block">
            DEFAULT PASSCODE: <strong className="text-accent">admin</strong>
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminLogin;

