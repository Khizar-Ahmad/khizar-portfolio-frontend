import { useState, useEffect } from 'react';
import { getHero } from '../../utils/api';

const TYPING_STRINGS = [
  'Full-Stack Engineer',
  'Backend Architect',
  'WebRTC Developer',
  'AI/LLM Builder',
  'Open to Opportunities',
];

function useTypingEffect(strings, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = strings[idx % strings.length];
    let timer;
    if (!deleting && charIdx < current.length) {
      timer = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timer = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timer = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setIdx(i => (i + 1) % strings.length);
    }
    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timer);
  }, [charIdx, deleting, idx, strings, speed, pause]);

  return display;
}

export default function Hero() {
  const [hero, setHero] = useState(null);
  const typed = useTypingEffect(TYPING_STRINGS);

  useEffect(() => {
    getHero().then(r => setHero(r.data)).catch(() => {});
  }, []);

  const name = hero?.name || 'Khizar';
  const title = hero?.title || 'Full-Stack Software Engineer';
  const tagline = hero?.tagline || 'Building scalable systems, intelligent agents, and real-time applications.';
  const bio = hero?.bio || 'Passionate about creating production-grade software that solves real problems. Specializing in FastAPI, React, LangGraph, and WebRTC — with a focus on distributed systems and AI-powered applications.';
  const location = hero?.location || 'Lahore, Pakistan';
  const yearsExp = hero?.years_experience || '4+';

  return (
    <section id="hero" className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '120px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 60, alignItems: 'center' }}>
          {/* Left Content */}
          <div style={{ animation: 'fadeUp 0.8s ease forwards' }}>
            {/* Status pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 14px',
              background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: 100, marginBottom: 28,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px #22c55e',
                animation: 'pulse-ring 1.5s ease-out infinite',
              }} />
              <span style={{ fontSize: 12, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                Available for opportunities
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', lineHeight: 1.1, marginBottom: 16 }}>
              Hey, I'm{' '}
              <span className="gradient-text">{name}</span>
            </h1>

            {/* Typing effect */}
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 'clamp(16px, 2.5vw, 22px)',
              color: 'var(--accent-cyan)', marginBottom: 20, height: 32, display: 'flex', alignItems: 'center',
            }}>
              <span>{typed}</span>
              <span className="typing-cursor" />
            </div>

            <p style={{
              color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.8,
              maxWidth: 560, marginBottom: 12,
            }}>{tagline}</p>

            <p style={{
              color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.8,
              maxWidth: 520, marginBottom: 36,
            }}>{bio}</p>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 32, marginBottom: 40 }}>
              {[
                { val: yearsExp, label: 'Years Coding' },
                { val: '2+', label: 'Companies' },
                { val: '10+', label: 'Projects' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--accent-cyan)' }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#projects" className="btn-primary">View My Work</a>
              {hero?.resume_url
                ? <a href={hero.resume_url} target="_blank" rel="noreferrer" className="btn-outline">Download Resume</a>
                : <a href="#chat" className="btn-outline">Talk to My Agent</a>
              }
            </div>

            {/* Social links */}
            <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
              {hero?.github_url && (
                <a href={hero.github_url} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  <GithubIcon /> GitHub
                </a>
              )}
              {hero?.linkedin_url && (
                <a href={hero.linkedin_url} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-cyan)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  <LinkedinIcon /> LinkedIn
                </a>
              )}
              {hero?.email && (
                <a href={`mailto:${hero.email}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-violet-light)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                  ✉️ {hero.email}
                </a>
              )}
              <span style={{ color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                📍 {location}
              </span>
            </div>
          </div>

          {/* Right — Profile Picture */}
          <div style={{ display: 'flex', justifyContent: 'center', animation: 'fadeIn 1s ease 0.3s both' }}>
            <ProfilePicture src={hero?.profile_picture} name={name} />
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ textAlign: 'center', marginTop: 80 }}>
          <a href="#experience" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--text-muted)', textDecoration: 'none' }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 2 }}>SCROLL</span>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--text-muted), transparent)' }} />
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #hero .container > div { grid-template-columns: 1fr !important; }
          #hero .container > div > div:last-child { display: none !important; }
        }
        @keyframes pulse-ring-hero {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
      `}</style>
    </section>
  );
}

function ProfilePicture({ src, name }) {
  const initial = name?.[0]?.toUpperCase() || 'K';
  return (
    <div style={{ position: 'relative' }}>
      {/* Glow ring */}
      <div style={{
        position: 'absolute', inset: -3,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-violet))',
        zIndex: 0,
      }} />
      <div style={{
        position: 'relative', zIndex: 1,
        width: 280, height: 280, borderRadius: '50%',
        overflow: 'hidden',
        border: '3px solid var(--bg-primary)',
      }}>
        {src ? (
          <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 80, fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white',
          }}>{initial}</div>
        )}
      </div>
      {/* Floating badges */}
      <FloatingBadge style={{ top: 20, right: -20 }} icon="⚡" label="WebRTC" />
      <FloatingBadge style={{ bottom: 40, left: -30 }} icon="🤖" label="LangGraph" />
    </div>
  );
}

function FloatingBadge({ style, icon, label }) {
  return (
    <div style={{
      position: 'absolute', ...style,
      background: 'var(--bg-card)',
      border: '1px solid var(--border-accent)',
      borderRadius: 12,
      padding: '8px 14px',
      fontSize: 12, fontFamily: 'var(--font-mono)',
      color: 'var(--accent-cyan)',
      display: 'flex', alignItems: 'center', gap: 6,
      boxShadow: '0 4px 20px rgba(0,212,255,0.15)',
      whiteSpace: 'nowrap',
    }}>
      <span>{icon}</span>{label}
    </div>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
