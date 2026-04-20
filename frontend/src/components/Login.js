import React, { useState } from 'react';
import { loginUser, setTokens, getProfile } from '../api';

export default function Login({ onLogin }) {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Email and password are required.'); return;
    }
    setLoading(true); setError('');
    try {
      // Step 1: Get JWT tokens
      const res = await loginUser(form);
      setTokens(res.data.access, res.data.refresh);

      // Step 2: Get user profile using the token
      const profileRes = await getProfile();
      onLogin(profileRes.data);
    } catch (err) {
      const msg = err.response?.data?.detail
        || err.response?.data?.non_field_errors?.[0]
        || 'Login failed. Please try again.';
      setError(msg);
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--offwhite)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        background: 'var(--navy)',
        padding: '0 36px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        flexShrink: 0,
      }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '50%',
          overflow: 'hidden', border: '2px solid var(--gold)', flexShrink: 0,
        }}>
          <img src="/campus.jpg" alt="USTP" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '15px', color: 'var(--white)', fontWeight: 700 }}>
            USTP — Cagayan de Oro
          </div>
          <div style={{ fontSize: '9.5px', color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
            Enrollment &amp; Sectioning System
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden', flexShrink: 0 }}>
        <img src="/campus.jpg" alt="USTP Campus" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%', filter: 'brightness(0.35)' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(100deg, rgba(13,35,83,0.8) 0%, rgba(13,35,83,0.4) 60%, transparent 100%)',
          display: 'flex', alignItems: 'center', padding: '0 60px',
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'inline-block', width: '32px', height: '2px', background: 'var(--gold)' }} />
              University of Science &amp; Technology of Southern Philippines
            </div>
            <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '36px', fontWeight: 700, color: 'white', lineHeight: 1.1, margin: 0 }}>
              Student Enrollment &amp;<br />Sectioning System
            </h1>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px 20px',
      }}>
        <div style={{
          background: 'var(--white)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: '0 8px 32px rgba(13,35,83,0.12)',
          width: '100%',
          maxWidth: '420px',
          overflow: 'hidden',
        }}>
          {/* Card header */}
          <div style={{ background: 'var(--navy)', padding: '22px 28px' }}>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '20px', fontWeight: 700, color: 'white', margin: 0 }}>
              Sign In
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0' }}>
              Use your email and password to continue
            </p>
          </div>

          {/* Card body */}
          <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
            {error && (
              <div className="alert alert-error" style={{ marginBottom: '20px' }}>
                ⚠ {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                autoFocus
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px' }}
            >
              {loading ? (
                <><div className="spinner" style={{ width: '16px', height: '16px', borderTopColor: 'white' }} /> Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <div style={{ padding: '0 28px 22px', fontSize: '12px', color: 'var(--text3)', textAlign: 'center' }}>
            Use the account created via Django admin panel
          </div>
        </div>
      </div>
    </div>
  );
}