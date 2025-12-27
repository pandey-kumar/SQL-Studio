require('dotenv').config();
const mongoose = require('mongoose');
const { Pool } = require('pg');
const Assignment = require('../models/Assignment.model');

// Sample assignments data
const assignments = [
  {
    title: 'Select All Employees',
    difficulty: 'Easy',
    category: 'SELECT',
    question: 'Write a SQL query to retrieve all columns from the employees table.',
    description: 'Learn the basics of SELECT statement by fetching all data from a table.',
    hints: ['Use SELECT * to get all columns', 'The table name is employees'],
    schemaName: 'assignment_1',
    points: 10,
    timeLimit: 10,
    sampleTables: [
      {
        tableName: 'employees',
        columns: [
          { columnName: 'id', dataType: 'INTEGER' },
          { columnName: 'name', dataType: 'VARCHAR' },
          { columnName: 'department', dataType: 'VARCHAR' },
          { columnName: 'salary', dataType: 'DECIMAL' },
          { columnName: 'hire_date', dataType: 'DATE' }
        ],
        rows: [
          [1, 'John Doe', 'Engineering', 75000, '2021-03-15'],
          [2, 'Jane Smith', 'Marketing', 65000, '2020-07-22'],
          [3, 'Bob Johnson', 'Engineering', 80000, '2019-01-10'],
          [4, 'Alice Brown', 'HR', 55000, '2022-05-01'],
          [5, 'Charlie Wilson', 'Marketing', 70000, '2021-09-30']
        ]
      }
    ],
    expectedOutput: {
      type: 'count',
      value: 5
    }
  },
  {
    title: 'Filter by Department',
    difficulty: 'Easy',
    category: 'WHERE',
    question: 'Write a SQL query to find all employees who work in the Engineering department.',
    description: 'Practice using WHERE clause to filter data based on conditions.',
    hints: ['Use WHERE clause to filter', 'String values need quotes'],
    schemaName: 'assignment_2',
    points: 15,
    timeLimit: 15,
    sampleTables: [
      {
        tableName: 'employees',
        columns: [
          { columnName: 'id', dataType: 'INTEGER' },
          { columnName: 'name', dataType: 'VARCHAR' },
          { columnName: 'department', dataType: 'VARCHAR' },
          { columnName: 'salary', dataType: 'DECIMAL' }
        ],
        rows: [
          [1, 'John Doe', 'Engineering', 75000],
          [2, 'Jane Smith', 'Marketing', 65000],
          [3, 'Bob Johnson', 'Engineering', 80000],
          [4, 'Alice Brown', 'HR', 55000],
          [5, 'Charlie Wilson', 'Marketing', 70000]
        ]
      }
    ],
    expectedOutput: {
      type: 'count',
      value: 2
    }
  },
  {
    title: 'Calculate Average Salary',
    difficulty: 'Medium',
    category: 'AGGREGATE',
    question: 'Write a SQL query to find the average salary of all employees.',
    description: 'Learn to use aggregate functions like AVG to perform calculations.',
    hints: ['Use AVG() function', 'Apply it to the salary column'],
    schemaName: 'assignment_3',
    points: 20,
    timeLimit: 20,
    sampleTables: [
      {
        tableName: 'employees',
        columns: [
          { columnName: 'id', dataType: 'INTEGER' },
          { columnName: 'name', dataType: 'VARCHAR' },
          { columnName: 'salary', dataType: 'DECIMAL' }
        ],
        rows: [
          [1, 'John Doe', 75000],
          [2, 'Jane Smith', 65000],
          [3, 'Bob Johnson', 80000],
          [4, 'Alice Brown', 55000],
          [5, 'Charlie Wilson', 70000]
        ]
      }
    ],
    expectedOutput: {
      type: 'single_value',
      value: 69000
    }
  },
  {
    title: 'Group by Department',
    difficulty: 'Medium',
    category: 'GROUP BY',
    question: 'Write a SQL query to find the total salary expense for each department.',
    description: 'Master GROUP BY clause to aggregate data by categories.',
    hints: ['Use GROUP BY with department', 'Use SUM() for total salary'],
    schemaName: 'assignment_4',
    points: 25,
    timeLimit: 25,
    sampleTables: [
      {
        tableName: 'employees',
        columns: [
          { columnName: 'id', dataType: 'INTEGER' },
          { columnName: 'name', dataType: 'VARCHAR' },
          { columnName: 'department', dataType: 'VARCHAR' },
          { columnName: 'salary', dataType: 'DECIMAL' }
        ],
        rows: [
          [1, 'John Doe', 'Engineering', 75000],
          [2, 'Jane Smith', 'Marketing', 65000],
          [3, 'Bob Johnson', 'Engineering', 80000],
          [4, 'Alice Brown', 'HR', 55000],
          [5, 'Charlie Wilson', 'Marketing', 70000]
        ]
      }
    ],
    expectedOutput: {
      type: 'count',
      value: 3
    }
  },
  {
    title: 'Join Orders with Customers',
    difficulty: 'Medium',
    category: 'JOIN',
    question: 'Write a SQL query to list all orders with their customer names. Show order_id, order_date, and customer_name.',
    description: 'Learn INNER JOIN to combine data from multiple related tables.',
    hints: ['Use INNER JOIN to connect tables', 'Join on customer_id'],
    schemaName: 'assignment_5',
    points: 30,
    timeLimit: 30,
    sampleTables: [
      {
        tableName: 'customers',
        columns: [
          { columnName: 'customer_id', dataType: 'INTEGER' },
          { columnName: 'customer_name', dataType: 'VARCHAR' },
          { columnName: 'email', dataType: 'VARCHAR' }
        ],
        rows: [
          [1, 'Tech Corp', 'info@techcorp.com'],
          [2, 'Data Inc', 'contact@datainc.com'],
          [3, 'Web Solutions', 'hello@websolutions.com']
        ]
      },
      {
        tableName: 'orders',
        columns: [
          { columnName: 'order_id', dataType: 'INTEGER' },
          { columnName: 'customer_id', dataType: 'INTEGER' },
          { columnName: 'order_date', dataType: 'DATE' },
          { columnName: 'total_amount', dataType: 'DECIMAL' }
        ],
        rows: [
          [101, 1, '2024-01-15', 5000],
          [102, 2, '2024-01-16', 3500],
          [103, 1, '2024-01-17', 7500],
          [104, 3, '2024-01-18', 2000]
        ]
      }
    ],
    expectedOutput: {
      type: 'count',
      value: 4
    }
  },
  {
    title: 'Find High-Value Customers',
    difficulty: 'Hard',
    category: 'SUBQUERY',
    question: 'Write a SQL query to find customers who have placed orders with total amount greater than the average order amount.',
    description: 'Advanced query using subqueries for complex filtering.',
    hints: ['Use a subquery to calculate average', 'Compare in WHERE clause'],
    schemaName: 'assignment_6',
    points: 40,
    timeLimit: 45,
    sampleTables: [
      {
        tableName: 'customers',
        columns: [
          { columnName: 'customer_id', dataType: 'INTEGER' },
          { columnName: 'customer_name', dataType: 'VARCHAR' }
        ],
        rows: [
          [1, 'Tech Corp'],
          [2, 'Data Inc'],
          [3, 'Web Solutions']
        ]
      },
      {
        tableName: 'orders',
        columns: [
          { columnName: 'order_id', dataType: 'INTEGER' },
          { columnName: 'customer_id', dataType: 'INTEGER' },
          { columnName: 'total_amount', dataType: 'DECIMAL' }
        ],
        rows: [
          [101, 1, 5000],
          [102, 2, 3500],
          [103, 1, 7500],
          [104, 3, 2000]
        ]
      }
    ],
    expectedOutput: {
      type: 'count',
      value: 2
    }
  },
  {
    title: 'Products Never Ordered',
    difficulty: 'Hard',
    category: 'SUBQUERY',
    question: 'Write a SQL query to find all products that have never been ordered.',
    description: 'Use NOT EXISTS or NOT IN subquery patterns.',
    hints: ['Consider using NOT IN or NOT EXISTS', 'Compare product_id across tables'],
    schemaName: 'assignment_7',
    points: 40,
    timeLimit: 45,
    sampleTables: [
      {
        tableName: 'products',
        columns: [
          { columnName: 'product_id', dataType: 'INTEGER' },
          { columnName: 'product_name', dataType: 'VARCHAR' },
          { columnName: 'price', dataType: 'DECIMAL' }
        ],
        rows: [
          [1, 'Laptop', 999.99],
          [2, 'Mouse', 29.99],
          [3, 'Keyboard', 79.99],
          [4, 'Monitor', 299.99],
          [5, 'Webcam', 89.99]
        ]
      },
      {
        tableName: 'order_items',
        columns: [
          { columnName: 'item_id', dataType: 'INTEGER' },
          { columnName: 'order_id', dataType: 'INTEGER' },
          { columnName: 'product_id', dataType: 'INTEGER' },
          { columnName: 'quantity', dataType: 'INTEGER' }
        ],
        rows: [
          [1, 101, 1, 2],
          [2, 101, 2, 5],
          [3, 102, 3, 3],
          [4, 103, 1, 1]
        ]
      }
    ],
    expectedOutput: {
      type: 'count',
      value: 2
    }
  },
  {
    title: 'Top Selling Products',
    difficulty: 'Hard',
    category: 'ADVANCED',
    question: 'Write a SQL query to find the top 3 products by total quantity sold. Show product name and total quantity.',
    description: 'Combine JOIN, GROUP BY, ORDER BY, and LIMIT for advanced data analysis.',
    hints: ['Join products with order_items', 'Use SUM and GROUP BY', 'Order by total and limit results'],
    schemaName: 'assignment_8',
    points: 50,
    timeLimit: 60,
    sampleTables: [
      {
        tableName: 'products',
        columns: [
          { columnName: 'product_id', dataType: 'INTEGER' },
          { columnName: 'product_name', dataType: 'VARCHAR' },
          { columnName: 'category', dataType: 'VARCHAR' }
        ],
        rows: [
          [1, 'Laptop', 'Electronics'],
          [2, 'Mouse', 'Accessories'],
          [3, 'Keyboard', 'Accessories'],
          [4, 'Monitor', 'Electronics'],
          [5, 'Webcam', 'Accessories']
        ]
      },
      {
        tableName: 'order_items',
        columns: [
          { columnName: 'item_id', dataType: 'INTEGER' },
          { columnName: 'product_id', dataType: 'INTEGER' },
          { columnName: 'quantity', dataType: 'INTEGER' }
        ],
        rows: [
          [1, 1, 10],
          [2, 2, 50],
          [3, 3, 30],
          [4, 1, 15],
          [5, 2, 25],
          [6, 4, 8],
          [7, 3, 20]
        ]
      }
    ],
    expectedOutput: {
      type: 'count',
      value: 3
    }
  }
];

// Connect to MongoDB
const connectMongo = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');
};

// Connect to PostgreSQL
const connectPostgres = async () => {
  const pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD
  });
  return pool;
};

// Create PostgreSQL schema and tables for an assignment
const createPostgresSchema = async (pool, assignment) => {
  const client = await pool.connect();
  
  try {
    // Create schema
    await client.query(`DROP SCHEMA IF EXISTS ${assignment.schemaName} CASCADE`);
    await client.query(`CREATE SCHEMA ${assignment.schemaName}`);
    
    // Create tables and insert data
    for (const table of assignment.sampleTables) {
      // Build column definitions
      const columnDefs = table.columns.map(col => {
        const pgType = {
          'INTEGER': 'INTEGER',
          'VARCHAR': 'VARCHAR(255)',
          'TEXT': 'TEXT',
          'DECIMAL': 'DECIMAL(10,2)',
          'REAL': 'REAL',
          'BOOLEAN': 'BOOLEAN',
          'DATE': 'DATE',
          'TIMESTAMP': 'TIMESTAMP',
          'SERIAL': 'SERIAL'
        }[col.dataType] || 'TEXT';
        
        return `${col.columnName} ${pgType}`;
      }).join(', ');
      
      // Create table
      await client.query(`
        CREATE TABLE ${assignment.schemaName}.${table.tableName} (${columnDefs})
      `);
      
      // Insert rows
      if (table.rows.length > 0) {
        const columnNames = table.columns.map(c => c.columnName).join(', ');
        
        for (const row of table.rows) {
          const values = row.map((val, idx) => {
            const colType = table.columns[idx].dataType;
            if (val === null) return 'NULL';
            if (['VARCHAR', 'TEXT', 'DATE', 'TIMESTAMP'].includes(colType)) {
              return `'${val}'`;
            }
            return val;
          }).join(', ');
          
          await client.query(`
            INSERT INTO ${assignment.schemaName}.${table.tableName} (${columnNames})
            VALUES (${values})
          `);
        }
      }
    }
    
    console.log(`  ✅ Created schema: ${assignment.schemaName}`);
  } finally {
    client.release();
  }
};

// Main seed function
const seedData = async () => {
  try {
    console.log('🌱 Starting database seed...\n');
    
    // Connect to databases
    await connectMongo();
    const pgPool = await connectPostgres();
    console.log('✅ Connected to PostgreSQL\n');
    
    // Clear existing assignments
    await Assignment.deleteMany({});
    console.log('🗑️  Cleared existing assignments\n');
    
    console.log('📝 Creating assignments...');
    
    // Create each assignment
    for (const assignmentData of assignments) {
      // Create MongoDB document
      const assignment = await Assignment.create(assignmentData);
      console.log(`  📄 Created: ${assignment.title}`);
      
      // Create PostgreSQL schema
      await createPostgresSchema(pgPool, assignmentData);
    }
    
    console.log('\n✅ Seed completed successfully!');
    console.log(`   Created ${assignments.length} assignments`);
    
    // Close connections
    await pgPool.end();
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

// Run seed
seedData();
