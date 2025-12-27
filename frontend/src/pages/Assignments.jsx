import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { assignmentAPI } from '../services/api';
import './Assignments.scss';

const DIFFICULTY_COLORS = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'error',
};

const CATEGORY_ICONS = {
  SELECT: 'ri-list-check-2',
  WHERE: 'ri-search-line',
  JOIN: 'ri-links-line',
  AGGREGATE: 'ri-bar-chart-2-line',
  SUBQUERY: 'ri-focus-3-line',
  'GROUP BY': 'ri-folder-3-line',
  ADVANCED: 'ri-rocket-line',
};

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    searchParams.get('difficulty') || ''
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || ''
  );

  useEffect(() => {
    fetchAssignments();
  }, [selectedDifficulty, selectedCategory]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedDifficulty) params.difficulty = selectedDifficulty;
      if (selectedCategory) params.category = selectedCategory;
      
      const { data } = await assignmentAPI.getAll(params);
      // API returns { success: true, data: { assignments: [...], pagination: {...} } }
      setAssignments(data.data?.assignments || data.assignments || []);
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
    updateSearchParams({ difficulty, category: selectedCategory });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    updateSearchParams({ difficulty: selectedDifficulty, category });
  };

  const updateSearchParams = ({ difficulty, category }) => {
    const params = new URLSearchParams();
    if (difficulty) params.set('difficulty', difficulty);
    if (category) params.set('category', category);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSelectedDifficulty('');
    setSelectedCategory('');
    setSearchParams({});
  };

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(search.toLowerCase())
  );

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const categories = ['SELECT', 'WHERE', 'JOIN', 'AGGREGATE', 'SUBQUERY', 'GROUP BY', 'ADVANCED'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="assignments">
      <div className="assignments__header">
        <div className="assignments__header-content">
          <motion.h1
            className="assignments__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            SQL Challenges
          </motion.h1>
          <motion.p
            className="assignments__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Choose a challenge and start practicing your SQL skills
          </motion.p>
        </div>
      </div>

      <div className="assignments__container">
        {/* Filters */}
        <motion.aside
          className="assignments__sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="assignments__search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search challenges..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="assignments__search-input"
            />
          </div>

          <div className="assignments__filter-group">
            <h3 className="assignments__filter-title">Difficulty</h3>
            <div className="assignments__filter-options">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  className={`assignments__filter-btn assignments__filter-btn--${DIFFICULTY_COLORS[diff]} ${
                    selectedDifficulty === diff ? 'assignments__filter-btn--active' : ''
                  }`}
                  onClick={() => handleDifficultyChange(selectedDifficulty === diff ? '' : diff)}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="assignments__filter-group">
            <h3 className="assignments__filter-title">Category</h3>
            <div className="assignments__filter-options assignments__filter-options--wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`assignments__filter-btn ${
                    selectedCategory === cat ? 'assignments__filter-btn--active' : ''
                  }`}
                  onClick={() => handleCategoryChange(selectedCategory === cat ? '' : cat)}
                >
                  <span className="assignments__filter-icon">{CATEGORY_ICONS[cat]}</span>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {(selectedDifficulty || selectedCategory) && (
            <button className="assignments__clear-btn" onClick={clearFilters}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
              Clear filters
            </button>
          )}
        </motion.aside>

        {/* Assignments Grid */}
        <main className="assignments__main">
          {loading ? (
            <div className="assignments__loading">
              <div className="assignments__loading-spinner" />
              <span>Loading challenges...</span>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <motion.div
              className="assignments__empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="assignments__empty-icon"><i className="ri-search-line"></i></span>
              <h3>No challenges found</h3>
              <p>Try adjusting your filters or search query</p>
              <button className="assignments__empty-btn" onClick={clearFilters}>
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              className="assignments__grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {filteredAssignments.map((assignment) => (
                  <motion.div
                    key={assignment._id}
                    variants={itemVariants}
                    layout
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Link
                      to={`/practice/${assignment._id}`}
                      className="assignments__card"
                    >
                      <div className="assignments__card-header">
                        <span className="assignments__card-icon">
                          <i className={CATEGORY_ICONS[assignment.category] || 'ri-file-text-line'}></i>
                        </span>
                        <span
                          className={`assignments__card-badge assignments__card-badge--${DIFFICULTY_COLORS[assignment.difficulty]}`}
                        >
                          {assignment.difficulty}
                        </span>
                      </div>
                      <h3 className="assignments__card-title">{assignment.title}</h3>
                      <p className="assignments__card-description">
                        {(assignment.description || assignment.question || '').substring(0, 100)}
                        {(assignment.description || assignment.question || '').length > 100 ? '...' : ''}
                      </p>
                      <div className="assignments__card-footer">
                        <span className="assignments__card-category">
                          {assignment.category}
                        </span>
                        <span className="assignments__card-action">
                          Start
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Assignments;
