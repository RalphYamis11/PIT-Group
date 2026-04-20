import React, { useState } from 'react';
import axios from 'axios';

export default function Register({ onSwitchToLogin }) {
  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    address: '',
    age: '',
    birthday: '',
    password: '',
    re_password: '',
  });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (form.password !== form.re_password) {
      setError('Passwords do not match.'); return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:8000/auth/users/', {
        email:      form.email,
        first_name: form.first_name,
        last_name:  form.last_name,
        address:    form.address,
        age:        form.age ? parseInt(form.age) : null,
        birthday:   form.birthday || null,
        password:   form.password,
        re_password: form.re_password,
      });
      setSuccess('Account created successfully! You can now log in.');
      setForm({
        email: '', first_name: '', last_name: '',
        address: '', age: '', birthday: '',
        password: '', re_password: '',
      });
    } catch (err) {
      const data = err.response?.data;
      if (data) {
       const messages = Object.entries(data)
  .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
  .join(' | ');
setError(messages);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    fontSize: '14px',
    color: 'var(--text)',
    background: 'var(--white)',
    boxSizing: 'border-box',
    outline: 'none',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text3)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '6px',
  };

  const groupStyle = { marginBottom: '16px' };

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

      {/* Form */}
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
          maxWidth: '520px',
          overflow: 'hidden',
        }}>
          {/* Card header */}
          <div style={{ background: 'var(--navy)', padding: '22px 28px' }}>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '20px', fontWeight: 700, color: 'white', margin: 0 }}>
              Create Account
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0' }}>
              Fill in your details to register
            </p>
          </div>

          {/* Card body */}
          <form onSubmit={handleSubmit} style={{ padding: '28px' }}>

            {error && (
              <div style={{
                background: '#fff0f0', border: '1px solid #ffcccc',
                borderRadius: '8px', padding: '12px 16px',
                fontSize: '13px', color: '#cc0000', marginBottom: '20px',
              }}>
                ⚠ {error}
              </div>
            )}

            {success && (
              <div style={{
                background: '#f0fff4', border: '1px solid #b2f5c8',
                borderRadius: '8px', padding: '12px 16px',
                fontSize: '13px', color: '#1a7a3c', marginBottom: '20px',
              }}>
                ✅ {success}
              </div>
            )}

            {/* Row: First + Last name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={groupStyle}>
                <label style={labelStyle}>First Name</label>
                <input style={inputStyle} name="first_name" placeholder="Juan" value={form.first_name} onChange={handleChange} required />
              </div>
              <div style={groupStyle}>
                <label style={labelStyle}>Last Name</label>
                <input style={inputStyle} name="last_name" placeholder="dela Cruz" value={form.last_name} onChange={handleChange} required />
              </div>
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Email Address</label>
              <input style={inputStyle} name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>Address</label>
              <input style={inputStyle} name="address" placeholder="123 Street, City" value={form.address} onChange={handleChange} />
            </div>

            {/* Row: Age + Birthday */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={groupStyle}>
                <label style={labelStyle}>Age</label>
                <input style={inputStyle} name="age" type="number" placeholder="20" value={form.age} onChange={handleChange} />
              </div>
              <div style={groupStyle}>
                <label style={labelStyle}>Birthday</label>
                <input style={inputStyle} name="birthday" type="date" value={form.birthday} onChange={handleChange} />
              </div>
            </div>

            {/* Row: Password + Confirm */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={groupStyle}>
                <label style={labelStyle}>Password</label>
                <input style={inputStyle} name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
              </div>
              <div style={groupStyle}>
                <label style={labelStyle}>Confirm Password</label>
                <input style={inputStyle} name="re_password" type="password" placeholder="••••••••" value={form.re_password} onChange={handleChange} required />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px',
                background: 'var(--navy)', color: 'white',
                border: 'none', borderRadius: '8px',
                fontSize: '15px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginTop: '8px',
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ padding: '0 28px 22px', textAlign: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text3)' }}>Already have an account? </span>
            <button
              onClick={onSwitchToLogin}
              style={{
                background: 'none', border: 'none',
                color: 'var(--navy)', fontWeight: 700,
                fontSize: '13px', cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
localhost