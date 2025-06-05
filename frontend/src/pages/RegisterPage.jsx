import React, { useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';  // <-- import toast
import './LoginPage.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match'); // toast error for mismatch
      return;
    }

    try {
      await api.post('/auth/register', { email, password });
      toast.success('Registration successful! Logging you in...');

      const res = await api.post('/auth/login', { email, password });
      const { access_token } = res.data;

      if (!access_token) {
        setError('Login failed: no token returned');
        toast.error('Login failed: no token returned');
        return;
      }

      localStorage.setItem('token', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      const userRes = await api.get('/users/profile');

      login(access_token, userRes.data);
      toast.success('Logged in successfully! Redirecting to Dashboard.');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <h2 className="auth-heading">Register</h2>

        {error && <p className="auth-error">{error}</p>}

        <label className="auth-label" htmlFor="email">Email Address</label>
        <input
          id="email"
          className="auth-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />

        <label className="auth-label" htmlFor="password">Password</label>
        <input
          id="password"
          className="auth-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <label className="auth-label" htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          className="auth-input"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          required
        />

        <button type="submit" className="auth-button">Register</button>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}
