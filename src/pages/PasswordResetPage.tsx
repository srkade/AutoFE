import React, { useState, useEffect } from 'react';
import { resetPassword } from '../services/api';

const PasswordResetPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);

  useEffect(() => {
    // Extract token from URL query parameters using window.location
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    if (resetToken) {
      setToken(resetToken);
      setLoading(false);
    } else {
      setError('No reset token found in the URL. Please check your password reset link.');
      setLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!token) {
      setError('No reset token found. Please try the password reset process again.');
      return;
    }

    try {
      setPasswordResetLoading(true);
      await resetPassword({ token, newPassword });
      setSuccess(true);
      setError('');
    } catch (err: any) {
      console.error('Password reset failed:', err);
      setError(err?.response?.data?.message || 'Password reset failed. Please try again.');
    } finally {
      setPasswordResetLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f4f6f9'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f4f6f9'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          padding: '30px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#28a745', marginBottom: '20px' }}>Password Reset Successful</h2>
          <p>Your password has been successfully reset. You can now log in with your new password.</p>
          <a 
            href="/login" 
            style={{
              display: 'inline-block',
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f4f6f9'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '30px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', color: '#007bff', marginBottom: '20px' }}>Reset Your Password</h2>
        
        {error && (
          <div style={{
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            {error}
          </div>
        )}

        {!token ? (
          <div style={{
            padding: '15px',
            backgroundColor: '#fff3cd',
            color: '#856404',
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            marginBottom: '15px'
          }}>
            No reset token found. Please check your password reset link.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '5px' }}>
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter new password"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={passwordResetLoading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: passwordResetLoading ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: passwordResetLoading ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              {passwordResetLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a 
            href="/login" 
            style={{
              color: '#007bff',
              textDecoration: 'none'
            }}
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;