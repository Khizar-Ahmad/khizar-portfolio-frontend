import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/ui/Navbar';
import Hero from './components/sections/Hero';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import AgentChat from './components/chat/AgentChat';
import Footer from './components/ui/Footer';
import AdminPanel from './components/admin/AdminPanel';
import AdminLoginModal from './components/admin/AdminLoginModal';
import './index.css';

function AppInner() {
  const { isAdmin } = useAuth();
  const [adminOpen, setAdminOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const handleAdminClick = () => {
    if (isAdmin) setAdminOpen(true);
    else setLoginOpen(true);
  };

  return (
    <>
      <Navbar onAdminClick={handleAdminClick} />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <AgentChat />
      </main>
      <Footer />
      <AdminLoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => { setLoginOpen(false); setAdminOpen(true); }}
      />
      <AdminPanel isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d1424',
            color: '#f0f4ff',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            fontSize: '13px',
          },
        }}
      />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <AppInner />
    </AuthProvider>
  );
}
