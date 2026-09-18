import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!key.trim()) return;
    setLoading(true);
    const ok = await login(key.trim());
    setLoading(false);
    if (ok) { setKey(''); onSuccess(); }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 20, padding: 40, width: 380,
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        animation: 'fadeUp 0.3s ease',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, margin: '0 auto 16px',
          }}>🔐</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 6 }}>Admin Access</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Enter your secret key to manage portfolio content</p>
        </div>

        <input
          type="password"
          className="input"
          placeholder="Enter admin secret key..."
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoFocus
          style={{ marginBottom: 16 }}
        />

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading || !key.trim()} style={{ flex: 1, justifyContent: 'center' }}>
            {loading ? 'Verifying...' : 'Unlock'}
          </button>
        </div>
      </div>
    </div>
  );
}
