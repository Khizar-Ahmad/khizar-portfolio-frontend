import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onAdminClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAdmin, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'About', href: '#hero' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Ask Agent', href: '#chat' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '16px 0',
      background: scrolled ? 'rgba(5,8,16,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
      transition: 'all 0.3s',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <a href="#hero" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-display)',
          }}>K</div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-secondary)' }}>
            khizar<span style={{ color: 'var(--accent-cyan)' }}>.dev</span>
          </span>
        </a>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="nav-links">
          {links.map(l => (
            <a key={l.label} href={l.href} style={{
              color: 'var(--text-secondary)', textDecoration: 'none',
              fontSize: 13, fontWeight: 500, transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--accent-cyan)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
            >{l.label}</a>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {isAdmin ? (
            <>
              <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 12 }} onClick={onAdminClick}>
                Admin Panel
              </button>
              <button className="btn-ghost" style={{ fontSize: 12 }} onClick={logout}>Logout</button>
            </>
          ) : (
            <button className="btn-ghost" style={{ fontSize: 12 }} onClick={onAdminClick}>
              🔐 Admin
            </button>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
