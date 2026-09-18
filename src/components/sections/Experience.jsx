import { useState, useEffect } from 'react';
import { getExperiences } from '../../utils/api';

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    getExperiences().then(r => {
      setExperiences(r.data || []);
    }).catch(() => {});
  }, []);

  if (experiences.length === 0) return null;

  const exp = experiences[active];

  return (
    <section id="experience" className="section">
      <div className="container">
        <div style={{ marginBottom: 60 }}>
          <div className="section-eyebrow">Experience</div>
          <h2 className="section-title">Where I've Built</h2>
          <p className="section-subtitle">My professional journey — the companies, roles, and challenges that shaped my craft.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>
          {/* Company list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {experiences.map((e, i) => (
              <button key={e.id} onClick={() => setActive(i)}
                style={{
                  background: active === i ? 'var(--accent-cyan-dim)' : 'transparent',
                  border: 'none',
                  borderLeft: `2px solid ${active === i ? 'var(--accent-cyan)' : 'var(--border)'}`,
                  padding: '14px 20px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '0 8px 8px 0',
                  transition: 'all 0.2s',
                  color: active === i ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                }}>
                <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-display)' }}>{e.company}</div>
                <div style={{ fontSize: 11, marginTop: 3, fontFamily: 'var(--font-mono)', opacity: 0.7 }}>
                  {e.start_date} – {e.is_current ? 'Present' : e.end_date}
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          {exp && (
            <div key={active} style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 22, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: 4 }}>
                    {exp.role}
                    <span style={{ color: 'var(--accent-cyan)' }}> @ </span>
                    {exp.company_url ? (
                      <a href={exp.company_url} target="_blank" rel="noreferrer"
                        style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}
                        onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.target.style.textDecoration = 'none'}>
                        {exp.company} ↗
                      </a>
                    ) : exp.company}
                  </h3>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 16 }}>
                    <span>📅 {exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}</span>
                    {exp.location && <span>📍 {exp.location}</span>}
                    {exp.is_current && (
                      <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
                        Current
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: 28, marginBottom: 24,
              }}>
                {exp.description ? (
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {exp.description.split('\n').filter(Boolean).map((line, i) => (
                      <li key={i} style={{ display: 'flex', gap: 12, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
                        <span style={{ color: 'var(--accent-cyan)', flexShrink: 0, marginTop: 2 }}>▹</span>
                        <span>{line.replace(/^[-•▹]\s*/, '')}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No description added yet.</p>
                )}
              </div>

              {/* Technologies */}
              {exp.technologies?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {exp.technologies.map(tech => (
                    <span key={tech} className="tech-badge">{tech}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #experience .container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
