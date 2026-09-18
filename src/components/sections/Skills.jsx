import { useState, useEffect } from 'react';
import { getSkills } from '../../utils/api';

export default function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    getSkills().then(r => setSkills(r.data || [])).catch(() => {});
  }, []);

  if (skills.length === 0) return null;

  // Group by category
  const grouped = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const categoryColors = {
    'Languages': { bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.25)', text: 'var(--accent-cyan)' },
    'Backend': { bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.3)', text: 'var(--accent-violet-light)' },
    'Frontend': { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.3)', text: '#ec4899' },
    'Databases': { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.3)', text: '#22c55e' },
    'DevOps / Cloud': { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.3)', text: '#fbbf24' },
    'AI / ML': { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)', text: '#ef4444' },
  };

  const defaultColor = { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', text: 'var(--text-secondary)' };

  return (
    <section id="skills" className="section">
      <div className="container">
        <div style={{ marginBottom: 60 }}>
          <div className="section-eyebrow">Skills</div>
          <h2 className="section-title">My Tech Toolkit</h2>
          <p className="section-subtitle">The technologies I reach for when building production systems.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {Object.entries(grouped).map(([category, items], catIdx) => {
            const colors = categoryColors[category] || defaultColor;
            return (
              <div key={category} className="card" style={{
                padding: 24, animation: `fadeUp 0.5s ease ${catIdx * 0.1}s both`,
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
                  paddingBottom: 16, borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: colors.text, boxShadow: `0 0 8px ${colors.text}`,
                  }} />
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600,
                    color: colors.text,
                  }}>{category}</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {items.map(skill => (
                    <div key={skill.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{skill.name}</span>
                        <span style={{ fontSize: 11, color: colors.text, fontFamily: 'var(--font-mono)' }}>
                          {skill.proficiency}%
                        </span>
                      </div>
                      <div style={{ height: 4, background: 'var(--bg-secondary)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${skill.proficiency}%`,
                          background: `linear-gradient(90deg, ${colors.text}, ${colors.text}88)`,
                          borderRadius: 2,
                          transition: 'width 1s ease',
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
