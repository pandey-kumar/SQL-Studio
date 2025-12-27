import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Header.scss';

// Theme Toggle Button Component
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      className="header__theme-toggle"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="header__theme-toggle-track">
        <motion.div
          className="header__theme-toggle-thumb"
          animate={{ x: isDark ? 0 : 24 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <AnimatePresence mode="wait">
            {isDark ? (
              <motion.svg
                key="moon"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                viewBox="0 0 24 24"
                fill="currentColor"
                className="header__theme-icon"
              >
                <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </motion.svg>
            ) : (
              <motion.svg
                key="sun"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                viewBox="0 0 24 24"
                fill="currentColor"
                className="header__theme-icon"
              >
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.div>
        <span className="header__theme-toggle-bg header__theme-toggle-bg--sun">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
          </svg>
        </span>
        <span className="header__theme-toggle-bg header__theme-toggle-bg--moon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        </span>
      </div>
    </motion.button>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { path: '/', label: 'Home', icon: 'ri-home-4-line' },
    { path: '/assignments', label: 'Practice', icon: 'ri-code-s-slash-line' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
      <div className="header__container">
        <Link to="/" className="header__logo">
          <motion.div
            className="header__logo-icon"
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="36" height="36" rx="8" stroke="url(#logoGradient)" strokeWidth="3"/>
              <path d="M12 14h16M12 20h12M12 26h8" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="28" cy="26" r="4" fill="url(#logoGradient)"/>
              <defs>
                <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40">
                  <stop stopColor="#6366f1"/>
                  <stop offset="1" stopColor="#06b6d4"/>
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          <span className="header__logo-text">
            Cipher<span className="header__logo-highlight">SQL</span>
          </span>
        </Link>

        <nav className={`header__nav ${isMobileMenuOpen ? 'header__nav--open' : ''}`}>
          <ul className="header__nav-list">
            {navItems.map((item) => (
              <li key={item.path} className="header__nav-item">
                <Link
                  to={item.path}
                  className={`header__nav-link ${isActive(item.path) ? 'header__nav-link--active' : ''}`}
                >
                  <span className="header__nav-icon"><i className={item.icon}></i></span>
                  <span className="header__nav-label">{item.label}</span>
                  {isActive(item.path) && (
                    <motion.div
                      className="header__nav-indicator"
                      layoutId="navIndicator"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <ThemeToggle />
          
          {user ? (
            <div className="header__user">
              <motion.div
                className="header__user-avatar"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </motion.div>
              <div className="header__user-dropdown">
                <div className="header__user-info">
                  <span className="header__user-name">{user.name}</span>
                  <span className="header__user-email">{user.email}</span>
                </div>
                <div className="header__user-divider" />
                <button onClick={logout} className="header__user-logout">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="header__auth-buttons">
              <Link to="/login" className="header__auth-btn header__auth-btn--login">
                Sign In
              </Link>
              <Link to="/register" className="header__auth-btn header__auth-btn--register">
                Get Started
              </Link>
            </div>
          )}

          <button
            className={`header__mobile-toggle ${isMobileMenuOpen ? 'header__mobile-toggle--open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="header__mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="header__mobile-nav">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`header__mobile-link ${isActive(item.path) ? 'header__mobile-link--active' : ''}`}
                  >
                    <span className="header__mobile-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              {!user && (
                <>
                  <div className="header__mobile-divider" />
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link to="/login" className="header__mobile-link">
                      Sign In
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link to="/register" className="header__mobile-link header__mobile-link--cta">
                      Get Started
                    </Link>
                  </motion.div>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
