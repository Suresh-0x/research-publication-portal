import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
          try {
      // 👈 Real Backend కాల్:
      const res = await api.post('/forgot-password', { email });
      setMessage(res.data.message || 'Password reset link sent to your email!');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to process request.');
    } finally {
      setLoading(false);
    }
      setMessage('Password reset instructions have been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to process request. Please check the email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card" style={{ maxWidth: '420px', padding: '2.5rem 2.2rem' }}>
        
        {/* Brand Key Icon */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.4)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-1.5 1.5L12 11a5.5 5.5 0 1 0-4 4l5.5-5.5m2.5-2.5l2-2" />
              <path d="M15.5 7.5L14 9l2 2 1.5-1.5" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 700, margin: 0 }}>
            Forgot Password?
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '0.4rem', marginBottom: 0 }}>
            Enter your registered email and we'll send you reset instructions.
          </p>
        </div>

        {/* Success Alert */}
        {message && (
          <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>{message}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email input with icon */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="field-label" htmlFor="email" style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.85rem', fontWeight: 600 }}>
              Email address
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <svg
                style={{
                  position: 'absolute',
                  left: '1rem',
                  color: '#94a3b8',
                  pointerEvents: 'none',
                }}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                id="email"
                name="email"
                type="email"
                className="field-input"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  paddingLeft: '2.75rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              margin: 0,
              height: '46px',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Back to Login link */}
        <p className="footer-text" style={{ marginTop: '1.75rem', marginBottom: 0 }}>
          Remember your password?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}