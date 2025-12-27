import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Footer.scss';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    learn: [
      { label: 'All Assignments', path: '/assignments' },
      { label: 'SQL Basics', path: '/assignments?category=SELECT' },
      { label: 'Advanced Queries', path: '/assignments?category=ADVANCED' },
    ],
    resources: [
      { label: 'SQL Documentation', href: 'https://www.postgresql.org/docs/', external: true },
      { label: 'Practice Problems', href: 'https://leetcode.com/problemset/database/', external: true },
    ],
    connect: [
      { label: 'GitHub', href: 'https://github.com', external: true, icon: 'github' },
      { label: 'LinkedIn', href: 'https://linkedin.com', external: true, icon: 'linkedin' },
    ],
  };

  const socialIcons = {
    github: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    linkedin: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  };

  return (
    <footer className="footer">
      <div className="footer__wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" />
        </svg>
      </div>

      <div className="footer__content">
        <div className="footer__container">
          <div className="footer__main">
            <div className="footer__brand">
              <Link to="/" className="footer__logo">
                <div className="footer__logo-icon">
                  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="36" height="36" rx="8" stroke="url(#footerLogoGradient)" strokeWidth="3"/>
                    <path d="M12 14h16M12 20h12M12 26h8" stroke="url(#footerLogoGradient)" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="28" cy="26" r="4" fill="url(#footerLogoGradient)"/>
                    <defs>
                      <linearGradient id="footerLogoGradient" x1="0" y1="0" x2="40" y2="40">
                        <stop stopColor="#6366f1"/>
                        <stop offset="1" stopColor="#06b6d4"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="footer__logo-text">
                  Cipher<span className="footer__logo-highlight">SQL</span>
                </span>
              </Link>
              <p className="footer__tagline">
                Master SQL through interactive challenges and real-world scenarios.
                Level up your database skills one query at a time.
              </p>
              <div className="footer__social">
                {footerLinks.connect.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer__social-link"
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={link.label}
                  >
                    {socialIcons[link.icon]}
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="footer__links">
              <div className="footer__links-group">
                <h4 className="footer__links-title">Learn</h4>
                <ul className="footer__links-list">
                  {footerLinks.learn.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path} className="footer__link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer__links-group">
                <h4 className="footer__links-title">Resources</h4>
                <ul className="footer__links-list">
                  {footerLinks.resources.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer__link"
                      >
                        {link.label}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="footer__bottom">
            <div className="footer__copyright">
              © {currentYear} CipherSQL Studio. Built with <i className="ri-heart-fill footer__heart-icon"></i> for SQL enthusiasts.
            </div>
            <div className="footer__tech">
              <span>Powered by</span>
              <div className="footer__tech-stack">
                <span className="footer__tech-item">React</span>
                <span className="footer__tech-separator">•</span>
                <span className="footer__tech-item">Node.js</span>
                <span className="footer__tech-separator">•</span>
                <span className="footer__tech-item">PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
