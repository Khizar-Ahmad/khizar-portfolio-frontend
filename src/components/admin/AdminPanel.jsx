import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  getHero, updateHero,
  getExperiences, createExperience, updateExperience, deleteExperience,
  getProjects, createProject, updateProject, deleteProject,
  getSkills, createSkill, deleteSkill,
} from '../../utils/api';

// ── Helpers ───────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>{label}</label>
      {children}
    </div>
  );
}

function toBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ── Hero Section ─────────────────────────────────────────────────────────────
function HeroForm() {
  const [data, setData] = useState({ name: '', title: '', tagline: '', bio: '', email: '', github_url: '', linkedin_url: '', resume_url: '', location: '', years_experience: '', profile_picture: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getHero().then(r => { if (r.data && r.data.name) setData(d => ({ ...d, ...r.data })); }).catch(() => {});
  }, []);

  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const b64 = await toBase64(file);
    set('profile_picture', b64);
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateHero(data);
      toast.success('Profile updated & embedded in RAG ✅');
    } catch { toast.error('Failed to save'); }
    setSaving(false);
  };

  return (
    <div>
      <h3 style={{ fontSize: 18, fontFamily: 'var(--font-display)', marginBottom: 24, color: 'var(--accent-cyan)' }}>Hero / Profile</h3>

      {/* Profile picture preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))',
          border: '2px solid var(--border-accent)', flexShrink: 0,
        }}>
          {data.profile_picture ? (
            <img src={data.profile_picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: 'white' }}>
              {data.name?.[0] || 'K'}
            </div>
          )}
        </div>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Profile Picture</p>
          <label className="btn-ghost" style={{ cursor: 'pointer', fontSize: 12 }}>
            📷 Upload Photo
            <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        <Field label="Full Name"><input className="input" value={data.name} onChange={e => set('name', e.target.value)} placeholder="Khizar Ahmed" /></Field>
        <Field label="Title / Role"><input className="input" value={data.title} onChange={e => set('title', e.target.value)} placeholder="Full-Stack Software Engineer" /></Field>
        <Field label="Location"><input className="input" value={data.location} onChange={e => set('location', e.target.value)} placeholder="Lahore, Pakistan" /></Field>
        <Field label="Years of Experience"><input className="input" value={data.years_experience} onChange={e => set('years_experience', e.target.value)} placeholder="4+" /></Field>
        <Field label="Email"><input className="input" value={data.email} onChange={e => set('email', e.target.value)} placeholder="khizar@example.com" /></Field>
        <Field label="GitHub URL"><input className="input" value={data.github_url} onChange={e => set('github_url', e.target.value)} placeholder="https://github.com/..." /></Field>
        <Field label="LinkedIn URL"><input className="input" value={data.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." /></Field>
        <Field label="Resume URL"><input className="input" value={data.resume_url} onChange={e => set('resume_url', e.target.value)} placeholder="https://..." /></Field>
      </div>
      <Field label="Tagline (1 line)"><input className="input" value={data.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Building scalable systems, intelligent agents..." /></Field>
      <Field label="Bio (paragraph)"><textarea className="input" rows={4} value={data.bio} onChange={e => set('bio', e.target.value)} placeholder="Tell your story..." /></Field>

      <button className="btn-primary" onClick={save} disabled={saving} style={{ marginTop: 8 }}>
        {saving ? 'Saving...' : '💾 Save Profile'}
      </button>
    </div>
  );
}

// ── Experience Section ────────────────────────────────────────────────────────
function ExperienceManager() {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const blank = { company: '', company_url: '', role: '', start_date: '', end_date: '', is_current: false, description: '', technologies: [], location: '', order_index: 0 };

  useEffect(() => { load(); }, []);
  const load = () => getExperiences().then(r => setList(r.data || [])).catch(() => {});

  const save = async () => {
    try {
      const techArr = typeof editing.technologies === 'string'
        ? editing.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : editing.technologies;
      const payload = { ...editing, technologies: techArr };
      if (editing.id) await updateExperience(editing.id, payload);
      else await createExperience(payload);
      toast.success('Experience saved & embedded ✅');
      setEditing(null); load();
    } catch { toast.error('Failed to save'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this experience?')) return;
    await deleteExperience(id);
    toast.success('Deleted');
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>Work Experience</h3>
        <button className="btn-primary" style={{ fontSize: 12, padding: '8px 16px' }} onClick={() => setEditing({ ...blank })}>+ Add Experience</button>
      </div>

      {/* List */}
      {list.map(e => (
        <div key={e.id} style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '16px 20px', marginBottom: 12,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{e.role} @ {e.company}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              {e.start_date} – {e.is_current ? 'Present' : e.end_date}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" style={{ fontSize: 11 }} onClick={() => setEditing({ ...e, technologies: (e.technologies || []).join(', ') })}>Edit</button>
            <button className="btn-ghost" style={{ fontSize: 11, borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }} onClick={() => del(e.id)}>Delete</button>
          </div>
        </div>
      ))}

      {/* Edit form modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 20 }}>{editing.id ? 'Edit' : 'Add'} Experience</h4>
            <Field label="Company Name"><input className="input" value={editing.company} onChange={e => setEditing(d => ({ ...d, company: e.target.value }))} /></Field>
            <Field label="Company URL (optional)"><input className="input" value={editing.company_url} onChange={e => setEditing(d => ({ ...d, company_url: e.target.value }))} placeholder="https://company.com" /></Field>
            <Field label="Role / Title"><input className="input" value={editing.role} onChange={e => setEditing(d => ({ ...d, role: e.target.value }))} /></Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              <Field label="Start Date"><input className="input" value={editing.start_date} onChange={e => setEditing(d => ({ ...d, start_date: e.target.value }))} placeholder="Jan 2023" /></Field>
              <Field label="End Date">
                <input className="input" value={editing.end_date || ''} disabled={editing.is_current} onChange={e => setEditing(d => ({ ...d, end_date: e.target.value }))} placeholder="Dec 2024" />
              </Field>
            </div>
            <Field label="">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={editing.is_current} onChange={e => setEditing(d => ({ ...d, is_current: e.target.checked, end_date: '' }))} />
                Currently working here
              </label>
            </Field>
            <Field label="Location"><input className="input" value={editing.location || ''} onChange={e => setEditing(d => ({ ...d, location: e.target.value }))} placeholder="Lahore, Pakistan" /></Field>
            <Field label="Technologies (comma separated)">
              <input className="input" value={editing.technologies} onChange={e => setEditing(d => ({ ...d, technologies: e.target.value }))} placeholder="FastAPI, React, PostgreSQL, Docker" />
            </Field>
            <Field label="Description (one achievement per line)">
              <textarea className="input" rows={5} value={editing.description || ''} onChange={e => setEditing(d => ({ ...d, description: e.target.value }))} placeholder="Built microservices chat platform with WebSockets&#10;Reduced API latency by 40%..." />
            </Field>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button className="btn-ghost" onClick={() => setEditing(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn-primary" onClick={save} style={{ flex: 1, justifyContent: 'center' }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Projects Section ──────────────────────────────────────────────────────────
function ProjectManager() {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const blank = { name: '', description: '', long_description: '', technologies: [], live_url: '', github_url: '', images: [], is_featured: false, order_index: 0 };

  useEffect(() => { load(); }, []);
  const load = () => getProjects().then(r => setList(r.data || [])).catch(() => {});

  const handleImages = async (e) => {
    const files = Array.from(e.target.files);
    const b64s = await Promise.all(files.map(toBase64));
    setEditing(d => ({ ...d, images: [...(d.images || []), ...b64s] }));
  };

  const removeImage = (idx) => setEditing(d => ({ ...d, images: d.images.filter((_, i) => i !== idx) }));

  const save = async () => {
    try {
      const techArr = typeof editing.technologies === 'string'
        ? editing.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : editing.technologies;
      const payload = { ...editing, technologies: techArr };
      if (editing.id) await updateProject(editing.id, payload);
      else await createProject(payload);
      toast.success('Project saved & embedded ✅');
      setEditing(null); setImageFiles([]); load();
    } catch { toast.error('Failed to save'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this project?')) return;
    await deleteProject(id);
    toast.success('Deleted');
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>Projects</h3>
        <button className="btn-primary" style={{ fontSize: 12, padding: '8px 16px' }} onClick={() => { setEditing({ ...blank }); setImageFiles([]); }}>+ Add Project</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {list.map(p => (
          <div key={p.id} style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 12, padding: 16,
          }}>
            {p.images?.[0] && (
              <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />
            )}
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn-ghost" style={{ fontSize: 10, padding: '4px 10px' }} onClick={() => setEditing({ ...p, technologies: (p.technologies || []).join(', ') })}>Edit</button>
              <button className="btn-ghost" style={{ fontSize: 10, padding: '4px 10px', borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }} onClick={() => del(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 20 }}>{editing.id ? 'Edit' : 'Add'} Project</h4>
            <Field label="Project Name"><input className="input" value={editing.name} onChange={e => setEditing(d => ({ ...d, name: e.target.value }))} /></Field>
            <Field label="Short Description"><input className="input" value={editing.description} onChange={e => setEditing(d => ({ ...d, description: e.target.value }))} /></Field>
            <Field label="Detailed Description (shown on expand)">
              <textarea className="input" rows={3} value={editing.long_description || ''} onChange={e => setEditing(d => ({ ...d, long_description: e.target.value }))} />
            </Field>
            <Field label="Technologies (comma separated)">
              <input className="input" value={editing.technologies} onChange={e => setEditing(d => ({ ...d, technologies: e.target.value }))} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              <Field label="Live URL (optional)"><input className="input" value={editing.live_url || ''} onChange={e => setEditing(d => ({ ...d, live_url: e.target.value }))} placeholder="https://..." /></Field>
              <Field label="GitHub URL"><input className="input" value={editing.github_url || ''} onChange={e => setEditing(d => ({ ...d, github_url: e.target.value }))} placeholder="https://github.com/..." /></Field>
            </div>

            {/* Images */}
            <Field label="Project Images">
              <label className="btn-ghost" style={{ cursor: 'pointer', display: 'inline-flex', fontSize: 12, marginBottom: 12 }}>
                📷 Add Images
                <input type="file" accept="image/*" multiple onChange={handleImages} style={{ display: 'none' }} />
              </label>
              {editing.images?.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {editing.images.map((img, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={img} alt="" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6 }} />
                      <button onClick={() => removeImage(i)} style={{
                        position: 'absolute', top: -6, right: -6,
                        width: 18, height: 18, borderRadius: '50%',
                        background: '#ef4444', border: 'none', color: 'white',
                        fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </Field>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
              <input type="checkbox" checked={editing.is_featured} onChange={e => setEditing(d => ({ ...d, is_featured: e.target.checked }))} />
              Featured project (shown with ⭐)
            </label>

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-ghost" onClick={() => setEditing(null)} style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button className="btn-primary" onClick={save} style={{ flex: 1, justifyContent: 'center' }}>Save Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Skills Section ────────────────────────────────────────────────────────────
function SkillManager() {
  const [list, setList] = useState([]);
  const [newSkill, setNewSkill] = useState({ category: '', name: '', proficiency: 85 });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = () => getSkills().then(r => setList(r.data || [])).catch(() => {});

  const add = async () => {
    if (!newSkill.category || !newSkill.name) return;
    setSaving(true);
    try {
      await createSkill(newSkill);
      toast.success('Skill added ✅');
      setNewSkill({ category: '', name: '', proficiency: 85 });
      load();
    } catch { toast.error('Failed'); }
    setSaving(false);
  };

  const del = async (id) => {
    await deleteSkill(id);
    toast.success('Removed');
    load();
  };

  const grouped = list.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <div>
      <h3 style={{ fontSize: 18, fontFamily: 'var(--font-display)', marginBottom: 24, color: 'var(--accent-cyan)' }}>Skills</h3>

      {/* Add form */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h4 style={{ fontSize: 14, marginBottom: 16, color: 'var(--text-secondary)' }}>Add Skill</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
          <Field label="Category">
            <input className="input" list="cats" value={newSkill.category} onChange={e => setNewSkill(d => ({ ...d, category: e.target.value }))} placeholder="Languages" />
            <datalist id="cats">
              {['Languages', 'Backend', 'Frontend', 'Databases', 'DevOps / Cloud', 'AI / ML'].map(c => <option key={c} value={c} />)}
            </datalist>
          </Field>
          <Field label="Skill Name">
            <input className="input" value={newSkill.name} onChange={e => setNewSkill(d => ({ ...d, name: e.target.value }))} placeholder="Python" onKeyDown={e => e.key === 'Enter' && add()} />
          </Field>
          <Field label={`Proficiency: ${newSkill.proficiency}%`}>
            <input type="range" min={10} max={100} value={newSkill.proficiency} onChange={e => setNewSkill(d => ({ ...d, proficiency: +e.target.value }))}
              style={{ width: '100%', accentColor: 'var(--accent-cyan)' }} />
          </Field>
          <button className="btn-primary" onClick={add} disabled={saving} style={{ padding: '10px 20px', fontSize: 13 }}>Add</button>
        </div>
      </div>

      {/* Grouped list */}
      {Object.entries(grouped).map(([cat, skills]) => (
        <div key={cat} style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--accent-violet-light)', marginBottom: 10 }}>{cat}</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {skills.map(s => (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '6px 12px',
              }}>
                <span style={{ fontSize: 13 }}>{s.name}</span>
                <span style={{ fontSize: 10, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{s.proficiency}%</span>
                <button onClick={() => del(s.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: '0 2px' }}>×</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── MAIN ADMIN PANEL ─────────────────────────────────────────────────────────
const TABS = ['Profile', 'Experience', 'Projects', 'Skills'];

export default function AdminPanel({ isOpen, onClose }) {
  const [tab, setTab] = useState('Profile');

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex' }}>
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />

      {/* Panel */}
      <div style={{
        position: 'relative', zIndex: 1,
        marginLeft: 'auto', width: '100%', maxWidth: 720,
        background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', height: '100vh',
        animation: 'fadeIn 0.3s ease',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 28px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg-card)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-cyan))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>⚙️</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16 }}>Admin Panel</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>All changes auto-sync to RAG</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '6px 12px', color: 'var(--text-secondary)',
            cursor: 'pointer', fontSize: 13,
          }}>✕ Close</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 28px', background: 'var(--bg-card)' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: 'none', border: 'none',
              borderBottom: `2px solid ${tab === t ? 'var(--accent-cyan)' : 'transparent'}`,
              padding: '14px 20px', cursor: 'pointer', fontSize: 13, fontWeight: 500,
              color: tab === t ? 'var(--accent-cyan)' : 'var(--text-muted)',
              transition: 'all 0.2s', marginBottom: -1,
            }}>{t}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
          {tab === 'Profile' && <HeroForm />}
          {tab === 'Experience' && <ExperienceManager />}
          {tab === 'Projects' && <ProjectManager />}
          {tab === 'Skills' && <SkillManager />}
        </div>
      </div>
    </div>
  );
}
