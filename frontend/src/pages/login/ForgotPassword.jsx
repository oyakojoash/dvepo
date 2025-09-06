import React, { useState } from 'react';
import API from '../../api'; // ✅ Axios instance with baseURL

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const { data } = await API.post('/api/auth/forgot-password', { email });
      setMessage(data.message || '✅ Code sent to your email or phone.');
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      return setMessage('❌ Passwords do not match');
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(newPassword)
    ) {
      return setMessage(
        '❌ Password must have uppercase, lowercase, number, and symbol'
      );
    }

    try {
      const { data } = await API.post('/api/auth/reset-password', {
        email,
        code,
        newPassword,
      });

      setMessage(data.message || '✅ Password reset successful. You can now login.');
      setStep(1);
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>🔐 Forgot Password</h2>

        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <input
              type="text"
              placeholder="Enter the 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Reset Password</button>
          </form>
        )}

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
