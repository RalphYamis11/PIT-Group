import React from 'react';
import { logoutUser } from '../api';

export default function Profile({ user, onLogout }) {
  const handleLogout = () => {
    logoutUser();
    onLogout();
  };

  const InfoRow = ({ label, value }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '13px 0', borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: '13px', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 500 }}>{value || '—'}</span>
    </div>
  );

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-PH', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const initials = (user.first_name?.[0] || '') + (user.last_name?.[0] || '') || user.email?.[0]?.toUpperCase() || 'U';
  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Your account information</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-danger" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'start' }}>

        {/* Left — Avatar Card */}
        <div className="card" style={{ textAlign: 'center', padding: '36px 24px' }}>
          <div style={{
            width: '90px', height: '90px', borderRadius: '50%',
            background: 'var(--navy)', color: 'var(--gold)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-head)', fontSize: '32px', fontWeight: 700,
            margin: '0 auto 18px', border: '3px solid var(--gold)',
          }}>
            {initials}
          </div>

          <div style={{ fontFamily: 'var(--font-head)', fontSize: '20px', fontWeight: 700, color: 'var(--navy)' }}>
            {fullName}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '4px' }}>
            {user.email}
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user.is_superuser && <span className="badge badge-navy">Superuser</span>}
            {user.is_staff    && <span className="badge badge-yellow">Staff</span>}
            {!user.is_staff && !user.is_superuser && <span className="badge badge-green">User</span>}
          </div>
        </div>

        {/* Right — Details Card */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Account Details</span>
          </div>
          <div style={{ padding: '6px 22px 10px' }}>
            <InfoRow label="Full Name"   value={fullName} />
            <InfoRow label="First Name"  value={user.first_name} />
            <InfoRow label="Last Name"   value={user.last_name} />
            <InfoRow label="Email"       value={user.email} />
            <InfoRow label="Role"        value={user.is_superuser ? 'Superuser' : user.is_staff ? 'Staff / Admin' : 'Regular User'} />
          </div>
        </div>

      </div>
    </div>
  );
}