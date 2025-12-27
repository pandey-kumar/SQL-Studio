const postgres = require('../config/postgres');
const Assignment = require('../models/Assignment.model');

// List of forbidden SQL keywords for safety
const FORBIDDEN_KEYWORDS = [
  'DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 'INSERT', 
  'UPDATE', 'GRANT', 'REVOKE', 'EXECUTE', 'EXEC'
];

// Validate and sanitize SQL query
const validateQuery = (query) => {
  // Remove SQL comments before validation
  const queryWithoutComments = query
    .replace(/--.*$/gm, '')  // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')  // Remove multi-line comments
    .trim();
  
  const upperQuery = queryWithoutComments.toUpperCase().trim();
  
  // Check if query is empty after removing comments
  if (!upperQuery) {
    return {
      valid: false,
      error: 'Query is empty. Please write a SELECT statement.'
    };
  }
  
  // Check for forbidden keywords
  for (const keyword of FORBIDDEN_KEYWORDS) {
    // Check if keyword appears as a standalone word
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(upperQuery)) {
      return {
        valid: false,
        error: `Query contains forbidden keyword: ${keyword}. Only SELECT queries are allowed.`
      };
    }
  }
  
  // Must start with SELECT
  if (!upperQuery.startsWith('SELECT')) {
    return {
      valid: false,
      error: 'Only SELECT queries are allowed.'
    };
  }
  
  // Check for multiple statements (SQL injection prevention)
  const statements = queryWithoutComments.split(';').filter(s => s.trim().length > 0);
  if (statements.length > 1) {
    return {
      valid: false,
      error: 'Multiple SQL statements are not allowed.'
    };
  }
  
  return { valid: true };
};

// Execute SQL query
exports.executeQuery = async (req, res, next) => {
  try {
    const { query, assignmentId } = req.body;
    
    if (!query || !assignmentId) {
      return res.status(400).json({
        success: false,
        message: 'Query and assignmentId are required'
      });
    }

    // Validate query
    const validation = validateQuery(query);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error
      });
    }

    // Get assignment to find schema name
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    const startTime = Date.now();
    
    // Execute query in the assignment's schema
    const result = await postgres.executeInSchema(
      assignment.schemaName,
      query,
      5000 // 5 second timeout
    );
    
    const executionTime = Date.now() - startTime;

    // Format the result
    const formattedResult = {
      columns: result.fields.map(f => f.name),
      rows: result.rows,
      rowCount: result.rowCount,
      executionTime
    };

    res.status(200).json({
      success: true,
      data: formattedResult
    });
  } catch (error) {
    // Handle PostgreSQL specific errors
    if (error.code) {
      const pgErrors = {
        '42601': 'Syntax error in SQL query',
        '42P01': 'Table does not exist',
        '42703': 'Column does not exist',
        '42883': 'Function does not exist',
        '57014': 'Query execution time exceeded limit'
      };
      
      return res.status(400).json({
        success: false,
        message: pgErrors[error.code] || error.message,
        detail: error.detail || null,
        hint: error.hint || null
      });
    }
    
    next(error);
  }
};

// Validate query result against expected output
exports.validateResult = async (req, res, next) => {
  try {
    const { query, assignmentId } = req.body;
    
    if (!query || !assignmentId) {
      return res.status(400).json({
        success: false,
        message: 'Query and assignmentId are required'
      });
    }

    // Validate query first
    const validation = validateQuery(query);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.error
      });
    }

    // Get assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Execute query
    const result = await postgres.executeInSchema(
      assignment.schemaName,
      query,
      5000
    );

    // Compare with expected output
    const expected = assignment.expectedOutput;
    let isCorrect = false;
    let feedback = '';

    switch (expected.type) {
      case 'count':
        isCorrect = result.rowCount === expected.value;
        feedback = isCorrect 
          ? 'Correct! Your query returned the expected number of rows.'
          : `Expected ${expected.value} rows, but got ${result.rowCount}.`;
        break;
        
      case 'single_value':
        const singleValue = result.rows[0] ? Object.values(result.rows[0])[0] : null;
        isCorrect = singleValue == expected.value;
        feedback = isCorrect
          ? 'Correct! Your query returned the expected value.'
          : 'The returned value does not match the expected result.';
        break;
        
      case 'table':
        // Compare table data (simplified comparison)
        isCorrect = JSON.stringify(result.rows) === JSON.stringify(expected.value);
        feedback = isCorrect
          ? 'Correct! Your query returned the expected table.'
          : 'The returned data does not match the expected result.';
        break;
        
      case 'column':
        const column = result.rows.map(row => Object.values(row)[0]);
        isCorrect = JSON.stringify(column) === JSON.stringify(expected.value);
        feedback = isCorrect
          ? 'Correct! Your query returned the expected column values.'
          : 'The column values do not match the expected result.';
        break;
        
      default:
        feedback = 'Unable to validate result type.';
    }

    res.status(200).json({
      success: true,
      data: {
        isCorrect,
        feedback,
        result: {
          columns: result.fields.map(f => f.name),
          rows: result.rows,
          rowCount: result.rowCount
        }
      }
    });
  } catch (error) {
    if (error.code) {
      return res.status(400).json({
        success: false,
        message: error.message,
        detail: error.detail || null
      });
    }
    next(error);
  }
};
