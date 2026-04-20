import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Subjects from './components/Subjects';
import Sections from './components/Sections';
import Enrollments from './components/Enrollments';
import Summary from './components/Summary';
import Login from './components/Login';
import Profile from './components/Profile';
import { getDashboardStats, checkAuth, logoutUser, clearTokens } from './api';
import './App.css';

const NAV_ITEMS = [
  { key: 'dashboard',   label: 'Dashboard'   },
  { key: 'students',    label: 'Students'    },
  { key: 'subjects',    label: 'Subjects'    },
  { key: 'sections',    label: 'Sections'    },
  { key: 'enrollments', label: 'Enrollments' },
  { key: 'summary',     label: 'Summary'     },
];

const PAGE_MAP = {
  dashboard: Dashboard, students: Students, subjects: Subjects,
  sections: Sections, enrollments: Enrollments, summary: Summary,
};

export default function App() {
  const [active, setActive] = useState('profile');
  const [heroStats, setHeroStats]     = useState(null);
  const [user, setUser]               = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check if already logged in on page load
  useEffect(() => {
    checkAuth()
      .then(res => setUser(res.data))
      .catch(() => clearTokens())
      .finally(() => setAuthLoading(false));
  }, []);

  // Load hero stats when logged in
  useEffect(() => {
    if (user) {
      getDashboardStats().then(r => setHeroStats(r.data)).catch(() => {});
    }
  }, [user]);

  const handleLogin = (userData) => {
  setUser(userData);
  setActive('profile');
};

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setActive('dashboard');
    setHeroStats(null);
  };

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--navy)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
        color: 'rgba(255,255,255,0.5)', fontSize: '14px',
      }}>
        <div className="spinner" style={{ borderTopColor: 'var(--gold)' }} />
        Loading...
      </div>
    );
  }

  if (!user) return <Login onLogin={handleLogin} />;

  const ActivePage = PAGE_MAP[active] || Dashboard;
  const initials   = user.first_name
    ? (user.first_name[0] + (user.last_name?.[0] || '')).toUpperCase()
    : user.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="app-shell">

      {/* ── Top Navbar ── */}
      <nav className="top-navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">
            <img src="/campus.jpg" alt="USTP"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          </div>
          <div className="navbar-brand-text">
            <span className="navbar-brand-title">USTP — Cagayan de Oro</span>
            <span className="navbar-brand-sub">Enrollment &amp; Sectioning System</span>
          </div>
        </div>

        <div className="navbar-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              className={`navbar-item ${active === item.key ? 'active' : ''}`}
              onClick={() => setActive(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="navbar-badge">AY 2025–2026</span>

          <button
            onClick={() => setActive('profile')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: active === 'profile' ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '100px',
              padding: '5px 14px 5px 6px',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: active === 'profile' ? 'var(--navy)' : 'var(--gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700,
              color: active === 'profile' ? 'var(--gold)' : 'var(--navy)',
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <span style={{
              fontSize: '13px', fontWeight: 600,
              color: active === 'profile' ? 'var(--navy)' : 'rgba(255,255,255,0.85)',
            }}>
              {user.first_name || user.email}
            </span>
          </button>
        </div>
      </nav>

      {/* ── Hero Banner ── */}
      <div className="hero-banner">
        <img src="/campus.jpg" alt="USTP Campus" />
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-tagline">University of Science &amp; Technology of Southern Philippines</div>
            <h1 className="hero-title">Student Enrollment &amp;<br />Sectioning System</h1>
            <p className="hero-desc">
              Streamline student enrollment, manage class sections, and track academic progress in one unified platform.
            </p>
          </div>
        </div>

        <div className="hero-stats">
          {[
            { label: 'Total Students',     value: heroStats?.total_students     ?? '—' },
            { label: 'Subjects',           value: heroStats?.total_subjects     ?? '—' },
            { label: 'Sections',           value: heroStats?.total_sections     ?? '—' },
            { label: 'Active Enrollments', value: heroStats?.active_enrollments ?? '—' },
            { label: 'Available Sections', value: heroStats?.available_sections ?? '—' },
          ].map(s => (
            <div className="hero-stat-item" key={s.label}>
              <div className="hero-stat-value">{s.value}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Page Content ── */}
      <main className="main-content">
        <div className="page-container">
          {active === 'profile'
            ? <Profile user={user} onLogout={handleLogout} />
            : <ActivePage />
          }
        </div>
      </main>

    </div>
  );
}
