import { useState, useEffect } from 'react';
import { getProjects } from '../../utils/api';

function ImageCarousel({ images, name }) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div style={{
        width: '100%', height: 200, background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)', fontSize: 13,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
          No preview available
        </div>
      </div>
    );
  }

  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length);
  const next = () => setCurrent(c => (c + 1) % images.length);

  return (
    <div style={{ position: 'relative', width: '100%', height: 200, borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <img src={images[current]} alt={`${name} screenshot ${current + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />

      {images.length > 1 && (
        <>
          <button onClick={prev} style={{
            position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white',
            width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', fontSize: 14,
          }}>‹</button>
          <button onClick={next} style={{
            position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.6)', border: 'none', color: 'white',
            width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', fontSize: 14,
          }}>›</button>
          <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4 }}>
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} style={{
                width: i === current ? 16 : 6, height: 6,
                borderRadius: 3, border: 'none', cursor: 'pointer',
                background: i === current ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.2s', padding: 0,
              }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProjectCard({ project }) {
  const [expanded, setExpanded] = useState(false);
  const isDeployed = !!project.live_url;

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Image area */}
      <div style={{ position: 'relative' }}>
        {isDeployed ? (
          <div style={{ width: '100%', height: 200, background: 'var(--bg-secondary)', overflow: 'hidden' }}>
            <img src={project.images?.[0]} alt={project.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.style.display = 'none'; }} />
          </div>
        ) : (
          <ImageCarousel images={project.images} name={project.name} />
        )}

        {/* Status badge */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '4px 10px', borderRadius: 100, fontSize: 10,
          fontFamily: 'var(--font-mono)', fontWeight: 500,
          background: isDeployed ? 'rgba(34,197,94,0.15)' : 'rgba(251,191,36,0.15)',
          border: `1px solid ${isDeployed ? 'rgba(34,197,94,0.4)' : 'rgba(251,191,36,0.4)'}`,
          color: isDeployed ? '#22c55e' : '#fbbf24',
        }}>
          {isDeployed ? '🟢 Live' : '🔧 In Dev'}
        </div>

        {project.is_featured && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            padding: '4px 10px', borderRadius: 100, fontSize: 10,
            fontFamily: 'var(--font-mono)', fontWeight: 500,
            background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)',
            color: 'var(--accent-violet-light)',
          }}>⭐ Featured</div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 8, color: 'var(--text-primary)' }}>
          {project.name}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>
          {project.description}
        </p>

        {expanded && project.long_description && (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.7, marginBottom: 12, animation: 'fadeIn 0.3s ease' }}>
            {project.long_description}
          </p>
        )}

        {project.long_description && (
          <button onClick={() => setExpanded(!expanded)} style={{
            background: 'none', border: 'none', color: 'var(--accent-cyan)',
            fontSize: 12, cursor: 'pointer', textAlign: 'left', padding: 0, marginBottom: 12,
            fontFamily: 'var(--font-mono)',
          }}>
            {expanded ? '↑ Show less' : '↓ Read more'}
          </button>
        )}

        {/* Tech badges */}
        {project.technologies?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {project.technologies.map(t => (
              <span key={t} className="tech-badge" style={{ fontSize: 10 }}>{t}</span>
            ))}
          </div>
        )}

        {/* Action links */}
        <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-ghost"
              style={{ fontSize: 12, flex: 1, justifyContent: 'center' }}>
              <GithubIcon /> Code
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer" className="btn-outline"
              style={{ fontSize: 12, flex: 1, justifyContent: 'center' }}>
              ↗ Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getProjects().then(r => setProjects(r.data || [])).catch(() => {});
  }, []);

  if (projects.length === 0) return null;

  const filters = ['all', 'featured', 'deployed', 'in-dev'];
  const filtered = projects.filter(p => {
    if (filter === 'featured') return p.is_featured;
    if (filter === 'deployed') return !!p.live_url;
    if (filter === 'in-dev') return !p.live_url;
    return true;
  });

  return (
    <section id="projects" className="section">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <div className="section-eyebrow">Projects</div>
          <h2 className="section-title">Things I've Built</h2>
          <p className="section-subtitle">From microservices platforms to AI agents — these are the projects that define my engineering style.</p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: '7px 18px', borderRadius: 100, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
                background: filter === f ? 'linear-gradient(135deg, var(--accent-violet), var(--accent-violet-light))' : 'var(--bg-card)',
                color: filter === f ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${filter === f ? 'transparent' : 'var(--border)'}`,
              }}>
              {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 24,
        }}>
          {filtered.map((p, i) => (
            <div key={p.id} style={{ animation: `fadeUp 0.5s ease ${i * 0.1}s both` }}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            No projects match this filter.
          </div>
        )}
      </div>
    </section>
  );
}

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
