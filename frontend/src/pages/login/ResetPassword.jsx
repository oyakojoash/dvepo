import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (newPassword.length < 8) {
      return setMessage('❌ Password must be at least 8 characters');
    }

    try {
      setLoading(true);
      const { data } = await API.post(`/auth/reset-password/${token}`, {
        newPassword,
      }, {
        withCredentials: true
      });

      setMessage('✅ ' + data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>🔒 Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : 'Reset Password'}
          </button>
        </form>
        {message && <p style={{ color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}
      </div>
    </div>
  );
}
