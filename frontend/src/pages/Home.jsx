import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.scss';

const Home = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    // Particle effect on hero section
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty('--mouse-x', `${x}%`);
      hero.style.setProperty('--mouse-y', `${y}%`);
    };

    hero.addEventListener('mousemove', handleMouseMove);
    return () => hero.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: 'ri-focus-3-line',
      title: 'Interactive Challenges',
      description: 'Practice SQL with real-world scenarios and progressively challenging assignments.',
    },
    {
      icon: 'ri-flashlight-line',
      title: 'Real-time Execution',
      description: 'Run your queries instantly against a PostgreSQL database and see immediate results.',
    },
    {
      icon: 'ri-robot-2-line',
      title: 'AI-Powered Hints',
      description: 'Get intelligent hints when stuck, powered by advanced AI without spoiling solutions.',
    },
    {
      icon: 'ri-bar-chart-box-line',
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed statistics and achievements.',
    },
  ];

  const stats = [
    { value: '50+', label: 'SQL Challenges' },
    { value: '8', label: 'Difficulty Levels' },
    { value: '∞', label: 'Practice Sessions' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="home__hero" ref={heroRef}>
        <div className="home__hero-bg">
          <div className="home__hero-gradient" />
          <div className="home__hero-grid" />
          <div className="home__hero-glow" />
        </div>

        <div className="home__hero-content">
          <motion.div
            className="home__hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="home__hero-badge-dot" />
            <span>Learn SQL the Fun Way</span>
          </motion.div>

          <motion.h1
            className="home__hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Master SQL with
            <span className="home__hero-title-highlight"> Interactive </span>
            Challenges
          </motion.h1>

          <motion.p
            className="home__hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Level up your database skills through hands-on practice. Write real queries,
            get instant feedback, and unlock achievements as you progress.
          </motion.p>

          <motion.div
            className="home__hero-actions"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/assignments" className="home__hero-btn home__hero-btn--primary">
              <span>Start Learning</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <a href="#features" className="home__hero-btn home__hero-btn--secondary">
              <span>Explore Features</span>
            </a>
          </motion.div>

          <motion.div
            className="home__hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="home__hero-stat">
                <span className="home__hero-stat-value">{stat.value}</span>
                <span className="home__hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating Code Preview */}
        <motion.div
          className="home__code-preview"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="home__code-header">
            <div className="home__code-dots">
              <span />
              <span />
              <span />
            </div>
            <span className="home__code-filename">query.sql</span>
          </div>
          <pre className="home__code-content">
            <code>
              <span className="home__code-keyword">SELECT</span>{' '}
              <span className="home__code-column">name</span>,{' '}
              <span className="home__code-column">department</span>
              {'\n'}
              <span className="home__code-keyword">FROM</span>{' '}
              <span className="home__code-table">employees</span>
              {'\n'}
              <span className="home__code-keyword">WHERE</span>{' '}
              <span className="home__code-column">salary</span>{' '}
              <span className="home__code-operator">&gt;</span>{' '}
              <span className="home__code-number">50000</span>
              {'\n'}
              <span className="home__code-keyword">ORDER BY</span>{' '}
              <span className="home__code-column">name</span>{' '}
              <span className="home__code-keyword">ASC</span>;
            </code>
          </pre>
          <div className="home__code-status">
            <span className="home__code-status-icon">✓</span>
            <span>Query executed successfully</span>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="home__features">
        <div className="home__features-container">
          <motion.div
            className="home__features-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="home__features-title">
              Everything you need to
              <span className="home__features-title-highlight"> excel at SQL</span>
            </h2>
            <p className="home__features-subtitle">
              Our platform provides a complete learning environment with all the tools
              you need to become a SQL expert.
            </p>
          </motion.div>

          <motion.div
            className="home__features-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="home__feature-card"
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <div className="home__feature-icon"><i className={feature.icon}></i></div>
                <h3 className="home__feature-title">{feature.title}</h3>
                <p className="home__feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="home__cta">
        <div className="home__cta-container">
          <motion.div
            className="home__cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="home__cta-bg" />
            <h2 className="home__cta-title">Ready to become a SQL master?</h2>
            <p className="home__cta-subtitle">
              Join thousands of learners who are leveling up their database skills.
            </p>
            <Link to="/assignments" className="home__cta-btn">
              Start Your Journey
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
