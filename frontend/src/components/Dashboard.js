import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../api';

const StatCard = ({ value, label, color, icon }) => (
  <div className={`stat-card ${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const MiniBar = ({ value, total, color, label }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '70px', fontSize: '12px', color: 'var(--text2)', flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: '6px', background: 'var(--bg3)', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '99px', transition: 'width 0.6s ease' }} />
      </div>
      <div style={{ width: '50px', textAlign: 'right', fontSize: '13px', fontWeight: 700, color: 'var(--text)', flexShrink: 0 }}>
        {value} <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--text3)' }}>({pct}%)</span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data))
      .catch(() => setError('Failed to load dashboard. Make sure the backend is running on port 8000.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /> Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">System overview at a glance</p>
        </div>
      </div>

      {error && <div className="alert alert-error">⚠ {error}</div>}

      {stats && (
        <>
          {/* Stat Cards */}
          <div className="stats-grid">
            <StatCard value={stats.total_students} label="Total Students" color="blue" icon="◈" />
            <StatCard value={stats.active_students ?? stats.total_students} label="Active Students" color="green" icon="◉" />
            <StatCard value={stats.total_subjects} label="Subjects" color="purple" icon="◫" />
            <StatCard value={stats.total_sections} label="Sections" color="yellow" icon="◎" />
            <StatCard value={stats.active_enrollments} label="Enrollments" color="green" icon="◑" />
            <StatCard value={stats.full_sections} label="Full Sections" color="red" icon="⬡" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            {/* Year Level Breakdown */}
            {stats.year_breakdown && (
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Students by Year Level</span>
                  <span className="badge badge-blue">{stats.total_students} total</span>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { key: 'year_1', label: '1st Year', color: 'var(--green)' },
                    { key: 'year_2', label: '2nd Year', color: 'var(--accent)' },
                    { key: 'year_3', label: '3rd Year', color: 'var(--accent2)' },
                    { key: 'year_4', label: '4th Year', color: 'var(--yellow)' },
                  ].map(({ key, label, color }) => (
                    <MiniBar
                      key={key}
                      label={label}
                      value={stats.year_breakdown[key] || 0}
                      total={stats.total_students}
                      color={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Subject Type Breakdown */}
            {stats.subject_type_breakdown && (
              <div className="card">
                <div className="card-header">
                  <span className="card-title">Subjects by Type</span>
                  <span className="badge badge-purple">{stats.total_subjects} total</span>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { key: 'lecture', label: 'Lecture', color: 'var(--accent)' },
                    { key: 'lab', label: 'Laboratory', color: 'var(--accent2)' },
                    { key: 'pe', label: 'PE', color: 'var(--green)' },
                    { key: 'nstp', label: 'NSTP', color: 'var(--yellow)' },
                  ].map(({ key, label, color }) => (
                    <MiniBar
                      key={key}
                      label={label}
                      value={stats.subject_type_breakdown[key] || 0}
                      total={stats.total_subjects}
                      color={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enrollment Overview */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Enrollment Overview</span>
            </div>
            <div style={{ padding: '20px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              {[
                { label: 'Active', value: stats.active_enrollments, color: 'var(--green)', badge: 'badge-green' },
                { label: 'Dropped', value: stats.dropped_enrollments || 0, color: 'var(--accent3)', badge: 'badge-red' },
                { label: 'Available Sections', value: stats.available_sections ?? (stats.total_sections - stats.full_sections), color: 'var(--accent)', badge: 'badge-blue' },
              ].map(({ label, value, badge }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`badge ${badge}`} style={{ fontSize: '18px', padding: '6px 14px', fontFamily: 'var(--font-head)', fontWeight: 800 }}>
                    {value}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text2)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
