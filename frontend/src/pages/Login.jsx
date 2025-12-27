import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Auth.scss';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/assignments';

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await login(formData);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__background">
        <div className="auth__gradient" />
        <div className="auth__grid" />
      </div>

      <motion.div
        className="auth__container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth__card">
          <div className="auth__header">
            <Link to="/" className="auth__logo">
              <div className="auth__logo-icon">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="36" height="36" rx="8" stroke="url(#authLogoGradient)" strokeWidth="3"/>
                  <path d="M12 14h16M12 20h12M12 26h8" stroke="url(#authLogoGradient)" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="28" cy="26" r="4" fill="url(#authLogoGradient)"/>
                  <defs>
                    <linearGradient id="authLogoGradient" x1="0" y1="0" x2="40" y2="40">
                      <stop stopColor="#6366f1"/>
                      <stop offset="1" stopColor="#06b6d4"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </Link>
            <h1 className="auth__title">Welcome back</h1>
            <p className="auth__subtitle">
              Sign in to continue your SQL journey
            </p>
          </div>

          <form className="auth__form" onSubmit={handleSubmit}>
            <div className="auth__field">
              <label htmlFor="email" className="auth__label">Email</label>
              <div className="auth__input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="auth__input"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth__field">
              <label htmlFor="password" className="auth__label">Password</label>
              <div className="auth__input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="auth__input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth__toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`auth__submit ${loading ? 'auth__submit--loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth__submit-spinner" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="auth__divider">
            <span>or continue with</span>
          </div>

          <Link to="/assignments" className="auth__guest-btn">
            Continue as Guest
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>

          <p className="auth__footer">
            Don't have an account?{' '}
            <Link to="/register" className="auth__link">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
