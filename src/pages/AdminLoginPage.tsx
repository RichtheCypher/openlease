import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, Home } from 'lucide-react';
import { store } from '../services/store';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await store.adminLogin(username, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error || 'Invalid credentials. Please verify your username and password.');
    }
    setLoading(false);
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    await store.adminLogin('staff', 'password123');
    navigate('/admin');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-main)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '3rem 1.5rem'
    }}>
      <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
        {/* Brand header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--text-primary)',
              color: 'var(--text-inverse)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '2px'
            }}>
              <Home size={18} />
            </div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 500, color: 'var(--text-primary)' }}>
              OpenLeasewithus
            </span>
          </Link>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Internal Leasing Staff & Review Portal
          </div>
        </div>

        {/* Login Box */}
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Shield size={18} color="var(--accent-olive)" />
            <h2 style={{ fontSize: '1.25rem' }}>Staff Authentication</h2>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'var(--status-rejected-bg)',
              color: 'var(--status-rejected)',
              border: '1px solid rgba(122, 40, 40, 0.2)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              marginBottom: '1.25rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }}>
                  <User size={15} />
                </span>
                <input
                  type="text"
                  required
                  className="form-control"
                  style={{ paddingLeft: '2rem' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }}>
                  <Lock size={15} />
                </span>
                <input
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '2rem' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block"
              style={{ marginTop: '1.5rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ArrowRight size={15} />
            </button>
          </form>

          <div style={{
            margin: '1.75rem 0 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{ flexGrow: 1, height: '1px', backgroundColor: 'var(--border-light)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Demo Access</span>
            <div style={{ flexGrow: 1, height: '1px', backgroundColor: 'var(--border-light)' }} />
          </div>

          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="btn btn-secondary btn-block btn-sm"
          >
            Sign In with Staff Demo Account
          </button>

          {/* Admin Credentials Info */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>Admin Credentials</div>
            <div><strong>Demo Username:</strong> staff</div>
            <div><strong>Demo Password:</strong> password123</div>
            <div><strong>Access:</strong> Any staff username with matching password</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8125rem' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>
            &larr; Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
