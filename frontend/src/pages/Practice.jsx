import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { toast } from 'react-hot-toast';
import { assignmentAPI, queryAPI, hintAPI, progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Practice.scss';

const DIFFICULTY_COLORS = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'error',
};

// Theme Toggle Button for Practice Page
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      className="practice__theme-toggle"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
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
          >
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const Practice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sessionId } = useAuth();
  const { theme } = useTheme();
  const editorRef = useRef(null);

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [hint, setHint] = useState('');
  const [loadingHint, setLoadingHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [activeTab, setActiveTab] = useState('schema');
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    fetchAssignment();
  }, [id]);

  const fetchAssignment = async () => {
    try {
      setLoading(true);
      const { data } = await assignmentAPI.getById(id);
      setAssignment(data.data);
      // Set initial query template
      setQuery(`-- ${data.data.title}\n-- Write your SQL query below\n\nSELECT * FROM `);
    } catch (error) {
      console.error('Failed to fetch assignment:', error);
      toast.error('Assignment not found');
      navigate('/assignments');
    } finally {
      setLoading(false);
    }
  };

  // Ref to hold the latest executeQuery function for Monaco editor
  const executeQueryRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Add Ctrl+Enter keybinding to run query
    editor.addAction({
      id: 'run-query',
      label: 'Run Query',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter
      ],
      run: () => {
        // Get the latest query value directly from the editor
        const currentQuery = editor.getValue();
        if (currentQuery.trim() && executeQueryRef.current) {
          executeQueryRef.current();
        }
      }
    });
  };

  const executeQuery = useCallback(async () => {
    if (!query.trim() || executing) return;

    try {
      setExecuting(true);
      setError(null);
      setResult(null);
      setIsCorrect(false);

      const { data } = await queryAPI.execute({
        query: query.trim(),
        assignmentId: id,
        schemaName: assignment?.schemaName,
      });

      if (data.success) {
        setResult(data.data);
        
        // Check if result matches expected output based on type
        let isMatch = false;
        if (assignment?.expectedOutput) {
          const expected = assignment.expectedOutput;
          const rows = data.data.rows;
          
          if (expected.type === 'count') {
            // Check row count
            isMatch = rows.length === expected.value;
          } else if (expected.type === 'single_value') {
            // Check single value (first column of first row)
            isMatch = rows.length > 0 && Object.values(rows[0])[0] == expected.value;
          } else if (expected.type === 'table') {
            // Check full table match
            isMatch = JSON.stringify(rows) === JSON.stringify(expected.value);
          }
        }
        
        if (isMatch) {
          setIsCorrect(true);
          toast.success('Correct! Great job!', { duration: 3000 });
          
          // Update progress
          try {
            await progressAPI.markCompleted(id, { hintsUsed });
          } catch (err) {
            console.error('Failed to update progress:', err);
          }
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to execute query';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setExecuting(false);
    }
  }, [query, id, assignment, executing, hintsUsed]);

  // Keep the ref updated with latest executeQuery function
  useEffect(() => {
    executeQueryRef.current = executeQuery;
  }, [executeQuery]);

  const getHint = async () => {
    if (loadingHint) return;

    try {
      setLoadingHint(true);
      const { data } = await hintAPI.getHint({
        assignmentId: id,
        currentQuery: query,
        hintsUsed,
      });

      setHint(data.data.hint);
      setShowHint(true);
      setHintsUsed((prev) => prev + 1);
      
      // Update progress
      try {
        await progressAPI.useHint(id);
      } catch (err) {
        console.error('Failed to update hint usage:', err);
      }
    } catch (err) {
      toast.error('Failed to get hint. Please try again.');
    } finally {
      setLoadingHint(false);
    }
  };

  const formatTable = (rows) => {
    if (!rows || rows.length === 0) return null;
    const columns = Object.keys(rows[0]);
    return { columns, rows };
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Enter to run query
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        executeQuery();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [executeQuery]);

  if (loading) {
    return (
      <div className="practice practice--loading">
        <div className="practice__loader">
          <div className="practice__loader-spinner" />
          <span>Loading challenge...</span>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return null;
  }

  const tableData = result ? formatTable(result.rows) : null;

  return (
    <div className="practice">
      {/* Header */}
      <header className="practice__header">
        <div className="practice__header-left">
          <Link to="/assignments" className="practice__back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </Link>
          <div className="practice__header-info">
            <h1 className="practice__title">{assignment.title}</h1>
            <div className="practice__meta">
              <span className={`practice__badge practice__badge--${DIFFICULTY_COLORS[assignment.difficulty]}`}>
                {assignment.difficulty}
              </span>
              <span className="practice__category">{assignment.category}</span>
            </div>
          </div>
        </div>
        <div className="practice__header-actions">
          <ThemeToggle />
          <button
            className="practice__hint-btn"
            onClick={getHint}
            disabled={loadingHint}
          >
            {loadingHint ? (
              <span className="practice__hint-btn-loading" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            )}
            <span>Get Hint</span>
            {hintsUsed > 0 && (
              <span className="practice__hint-count">{hintsUsed}</span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="practice__content">
        {/* Left Panel - Assignment Info */}
        <aside className="practice__sidebar">
          <div className="practice__tabs">
            <button
              className={`practice__tab ${activeTab === 'schema' ? 'practice__tab--active' : ''}`}
              onClick={() => setActiveTab('schema')}
            >
              Schema
            </button>
            <button
              className={`practice__tab ${activeTab === 'question' ? 'practice__tab--active' : ''}`}
              onClick={() => setActiveTab('question')}
            >
              Question
            </button>
            <button
              className={`practice__tab ${activeTab === 'expected' ? 'practice__tab--active' : ''}`}
              onClick={() => setActiveTab('expected')}
            >
              Expected
            </button>
          </div>

          <div className="practice__tab-content">
            <AnimatePresence mode="wait">
              {activeTab === 'schema' && (
                <motion.div
                  key="schema"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="practice__schema"
                >
                  <h3 className="practice__section-title">Available Tables</h3>
                  {assignment.sampleTables?.map((table, index) => {
                    // Get column names - handle both object format {columnName, dataType} and string format
                    const columnNames = table.columns?.map(col => 
                      typeof col === 'object' ? col.columnName : col
                    ) || [];
                    
                    return (
                      <div key={index} className="practice__table-info">
                        <div className="practice__table-name">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <path d="M3 9h18M9 21V9"/>
                          </svg>
                          {table.tableName || table.name}
                        </div>
                        <div className="practice__table-columns">
                          {table.columns?.map((col, colIndex) => (
                            <span key={colIndex} className="practice__column">
                              {typeof col === 'object' ? `${col.columnName} (${col.dataType})` : col}
                            </span>
                          ))}
                        </div>
                        {table.rows && table.rows.length > 0 && (
                          <div className="practice__sample-data">
                            <span className="practice__sample-label">Sample data:</span>
                            <div className="practice__sample-table">
                              <table>
                                <thead>
                                  <tr>
                                    {columnNames.map((col, i) => (
                                      <th key={i}>{col}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {table.rows.slice(0, 3).map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                      {Array.isArray(row) ? (
                                        row.map((cell, cellIndex) => (
                                          <td key={cellIndex}>{String(cell ?? '')}</td>
                                        ))
                                      ) : (
                                        columnNames.map((col, colIndex) => (
                                          <td key={colIndex}>{String(row[col] ?? '')}</td>
                                        ))
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              )}

              {activeTab === 'question' && (
                <motion.div
                  key="question"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="practice__question"
                >
                  <h3 className="practice__section-title">Challenge</h3>
                  <p className="practice__question-text">{assignment.question}</p>
                </motion.div>
              )}

              {activeTab === 'expected' && (
                <motion.div
                  key="expected"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="practice__expected"
                >
                  {/* LeetCode-style Example Section */}
                  <div className="practice__example">
                    <h3 className="practice__example-title">
                      <span className="practice__example-badge">Example 1</span>
                    </h3>

                    {/* Input Section - Show Tables */}
                    <div className="practice__example-section">
                      <div className="practice__example-label">Input:</div>
                      <div className="practice__example-tables">
                        {assignment.sampleTables?.map((table, index) => {
                          const columnNames = table.columns?.map(col => 
                            typeof col === 'object' ? col.columnName : col
                          ) || [];
                          
                          return (
                            <div key={index} className="practice__example-table">
                              <div className="practice__example-table-name">{table.tableName || table.name} table:</div>
                              <div className="practice__example-table-wrapper">
                                <table>
                                  <thead>
                                    <tr>
                                      {columnNames.map((col, i) => (
                                        <th key={i}>{col}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {table.rows?.map((row, rowIndex) => (
                                      <tr key={rowIndex}>
                                        {Array.isArray(row) ? (
                                          row.map((cell, cellIndex) => (
                                            <td key={cellIndex}>{String(cell ?? 'NULL')}</td>
                                          ))
                                        ) : (
                                          columnNames.map((col, colIndex) => (
                                            <td key={colIndex}>{String(row[col] ?? 'NULL')}</td>
                                          ))
                                        )}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Output Section */}
                    <div className="practice__example-section">
                      <div className="practice__example-label">Output:</div>
                      <div className="practice__example-output">
                        {assignment.expectedOutput ? (
                          <>
                            {assignment.expectedOutput.type === 'table' && Array.isArray(assignment.expectedOutput.value) && assignment.expectedOutput.value.length > 0 ? (
                              <div className="practice__example-table-wrapper">
                                <table>
                                  <thead>
                                    <tr>
                                      {Object.keys(assignment.expectedOutput.value[0]).map((key) => (
                                        <th key={key}>{key}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {assignment.expectedOutput.value.map((row, index) => (
                                      <tr key={index}>
                                        {Object.values(row).map((value, i) => (
                                          <td key={i}>{String(value)}</td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : assignment.expectedOutput.type === 'count' ? (
                              <div className="practice__example-result">
                                <span className="practice__example-result-text">
                                  Result should contain <strong>{assignment.expectedOutput.value}</strong> row{assignment.expectedOutput.value !== 1 ? 's' : ''}
                                </span>
                              </div>
                            ) : assignment.expectedOutput.type === 'single_value' ? (
                              <div className="practice__example-result">
                                <div className="practice__example-value-box">
                                  {String(assignment.expectedOutput.value)}
                                </div>
                              </div>
                            ) : (
                              <pre className="practice__example-pre">{JSON.stringify(assignment.expectedOutput.value, null, 2)}</pre>
                            )}
                          </>
                        ) : (
                          <span className="practice__example-result-text">Output will be verified upon execution</span>
                        )}
                      </div>
                    </div>

                    {/* Explanation Section */}
                    <div className="practice__example-section">
                      <div className="practice__example-label">Explanation:</div>
                      <div className="practice__example-explanation">
                        {assignment.expectedOutput?.type === 'count' && (
                          <p>
                            Write a query that returns exactly <strong>{assignment.expectedOutput.value}</strong> rows from the given table(s). 
                            The result should match all the conditions specified in the problem.
                          </p>
                        )}
                        {assignment.expectedOutput?.type === 'single_value' && (
                          <p>
                            Your query should return a single value: <strong>{String(assignment.expectedOutput.value)}</strong>. 
                            Use aggregate functions like COUNT, SUM, AVG, MIN, or MAX as needed.
                          </p>
                        )}
                        {assignment.expectedOutput?.type === 'table' && (
                          <p>
                            Your query should return the exact table shown above with matching columns and rows.
                          </p>
                        )}
                        {!assignment.expectedOutput && (
                          <p>Run your query to see if it produces the correct output.</p>
                        )}
                      </div>
                    </div>

                    {/* Constraints/Notes */}
                    <div className="practice__example-section">
                      <div className="practice__example-label">Constraints:</div>
                      <ul className="practice__example-constraints">
                        <li>Only SELECT queries are allowed</li>
                        <li>Query must execute within time limit</li>
                        {assignment.sampleTables?.map((table, i) => (
                          <li key={i}>{table.tableName || table.name} has {table.rows?.length || 0} rows</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Right Panel - Editor & Results */}
        <main className="practice__main">
          {/* Editor */}
          <div className="practice__editor-wrapper">
            <div className="practice__editor-header">
              <span className="practice__editor-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
                </svg>
                SQL Editor
              </span>
              <div className="practice__editor-actions">
                <span className="practice__shortcut">
                  <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run
                </span>
              </div>
            </div>
            <div className="practice__editor">
              <Editor
                height="100%"
                language="sql"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={query}
                onChange={(value) => setQuery(value || '')}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  glyphMargin: false,
                  folding: true,
                  lineDecorationsWidth: 10,
                  lineNumbersMinChars: 3,
                  renderLineHighlight: 'all',
                  wordWrap: 'on',
                  automaticLayout: true,
                  tabSize: 2,
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>
            <div className="practice__editor-footer">
              <button
                className={`practice__run-btn ${executing ? 'practice__run-btn--loading' : ''}`}
                onClick={executeQuery}
                disabled={executing || !query.trim()}
              >
                {executing ? (
                  <>
                    <span className="practice__run-btn-spinner" />
                    Executing...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Run Query
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="practice__results">
            <div className="practice__results-header">
              <span className="practice__results-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20V10M18 20V4M6 20v-4"/>
                </svg>
                Results
              </span>
              {result && (
                <span className="practice__results-info">
                  {result.rowCount} row{result.rowCount !== 1 ? 's' : ''} • {result.executionTime}ms
                </span>
              )}
            </div>

            <div className="practice__results-content">
              <AnimatePresence mode="wait">
                {isCorrect && (
                  <motion.div
                    className="practice__success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className="practice__success-icon"><i className="ri-checkbox-circle-fill"></i></div>
                    <h3>Excellent!</h3>
                    <p>Your query produces the correct output!</p>
                    <Link to="/assignments" className="practice__success-btn">
                      Next Challenge
                    </Link>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    className="practice__error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="practice__error-header">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                      Error
                    </div>
                    <pre className="practice__error-message">{error}</pre>
                  </motion.div>
                )}

                {tableData && !isCorrect && (
                  <motion.div
                    className="practice__result-table"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <table>
                      <thead>
                        <tr>
                          {tableData.columns.map((col) => (
                            <th key={col}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.rows.map((row, index) => (
                          <tr key={index}>
                            {tableData.columns.map((col) => (
                              <td key={col}>{String(row[col] ?? 'NULL')}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}

                {!result && !error && !isCorrect && (
                  <div className="practice__results-empty">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 20V10M18 20V4M6 20v-4"/>
                    </svg>
                    <p>Run a query to see results</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      {/* Hint Modal */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            className="practice__modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHint(false)}
          >
            <motion.div
              className="practice__modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="practice__modal-header">
                <h3>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Hint #{hintsUsed}
                </h3>
                <button
                  className="practice__modal-close"
                  onClick={() => setShowHint(false)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <div className="practice__modal-content">
                <p>{hint}</p>
              </div>
              <div className="practice__modal-footer">
                <button
                  className="practice__modal-btn"
                  onClick={() => setShowHint(false)}
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Practice;
