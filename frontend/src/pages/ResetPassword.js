import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/reset-password', { token, newPassword });
      
      // ✅ Show success message on screen
      setSuccessMessage(res.data.message || 'Your password has been updated successfully!');
      
      // Redirect to login after 2.5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset link is expired or invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card" style={{ maxWidth: '420px', padding: '2.5rem 2.2rem' }}>
        
        {/* Lock Icon */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: successMessage
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.3s ease',
            }}
          >
            {successMessage ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            )}
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 700, margin: 0 }}>
            {successMessage ? 'Success!' : 'Set New Password'}
          </h2>
        </div>

        {/* Success Alert */}
        {successMessage ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div
              className="alert alert-success"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                fontSize: '0.92rem',
                fontWeight: 600,
                padding: '1rem',
                marginBottom: '1rem',
              }}
            >
              <span>{successMessage}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Redirecting to login page in a few seconds...
            </p>
          </div>
        ) : (
          /* Form (Only shows when not yet updated) */
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div style={{ marginBottom: '1.15rem' }}>
              <label className="field-label" style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.85rem', fontWeight: 600 }}>
                New Password
              </label>
              <input
                type="password"
                className="field-input"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="field-label" style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.85rem', fontWeight: 600 }}>
                Confirm Password
              </label>
              <input
                type="password"
                className="field-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', height: '46px', borderRadius: '12px', fontWeight: 600, fontSize: '0.95rem' }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        {!successMessage && (
          <p className="footer-text" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Back to login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}