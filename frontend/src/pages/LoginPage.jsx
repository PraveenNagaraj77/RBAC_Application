import React, { useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';  // import toast
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
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

      toast.success('Login successful! Redirecting...');
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <h2 className="auth-heading">Sign In</h2>

        {error && <p className="auth-error">{error}</p>}

        <label className="auth-label" htmlFor="email">Email Address</label>
        <input
          className="auth-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          required
        />

        <label className="auth-label" htmlFor="password">Password</label>
        <input
          className="auth-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          required
        />

        <button type="submit" className="auth-button">Login</button>

        <p className="auth-link">
          New user? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}
