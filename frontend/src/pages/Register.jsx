import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Auth.scss';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      toast.success('Account created successfully!');
      navigate('/assignments');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { label: 'Weak', color: 'error' },
      { label: 'Fair', color: 'warning' },
      { label: 'Good', color: 'warning' },
      { label: 'Strong', color: 'success' },
      { label: 'Very Strong', color: 'success' },
    ];

    return {
      strength,
      ...levels[Math.min(strength - 1, 4)] || { label: '', color: '' },
    };
  };

  const passwordStrength = getPasswordStrength();

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
                  <rect x="2" y="2" width="36" height="36" rx="8" stroke="url(#authLogoGradient2)" strokeWidth="3"/>
                  <path d="M12 14h16M12 20h12M12 26h8" stroke="url(#authLogoGradient2)" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="28" cy="26" r="4" fill="url(#authLogoGradient2)"/>
                  <defs>
                    <linearGradient id="authLogoGradient2" x1="0" y1="0" x2="40" y2="40">
                      <stop stopColor="#6366f1"/>
                      <stop offset="1" stopColor="#06b6d4"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </Link>
            <h1 className="auth__title">Create account</h1>
            <p className="auth__subtitle">
              Start your SQL learning journey today
            </p>
          </div>

          <form className="auth__form" onSubmit={handleSubmit}>
            <div className="auth__field">
              <label htmlFor="name" className="auth__label">Full Name</label>
              <div className="auth__input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="auth__input"
                  autoComplete="name"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
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
              {formData.password && (
                <div className="auth__password-strength">
                  <div className="auth__password-strength-bar">
                    <div
                      className={`auth__password-strength-fill auth__password-strength-fill--${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`auth__password-strength-label auth__password-strength-label--${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="auth__field">
              <label htmlFor="confirmPassword" className="auth__label">Confirm Password</label>
              <div className="auth__input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="auth__input"
                  autoComplete="new-password"
                />
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <span className="auth__field-error">Passwords do not match</span>
              )}
            </div>

            <button
              type="submit"
              className={`auth__submit ${loading ? 'auth__submit--loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth__submit-spinner" />
                  Creating account...
                </>
              ) : (
                'Create Account'
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
            Already have an account?{' '}
            <Link to="/login" className="auth__link">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
