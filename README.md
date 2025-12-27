# 🔐 CipherSQLStudio

<div align="center">

![CipherSQLStudio Banner](https://img.shields.io/badge/SQL-Learning%20Platform-blue?style=for-the-badge&logo=postgresql)

**A modern, browser-based SQL learning platform for practicing SQL queries with real-time execution and AI-powered hints**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=flat-square&logo=postgresql)](https://postgresql.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---


## 🎯 Overview

**CipherSQLStudio** is an interactive SQL learning platform designed for students and developers to practice SQL queries in a safe, sandboxed environment. Inspired by platforms like LeetCode, it provides a hands-on approach to learning SQL with:

- Real-time query execution against actual PostgreSQL databases
- Intelligent AI-powered hints using Google Gemini
- LeetCode-style problem format with examples and constraints
- Progress tracking and performance analytics
- Beautiful, responsive UI with dark mode

---

## 🏆 Core Features

<div align="center">

<img src="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/icons/System/star-line.svg" width="24" style="vertical-align:middle;"/> <b>All core features are fully implemented and production-ready!</b>

</div>

### 1. Assignment Listing Page
- Displays all available SQL assignments
- Shows assignment difficulty, title, and brief description
- Allows users to select an assignment to attempt

### 2. Assignment Attempt Interface
- **Question Panel**: Shows the selected assignment question and requirements
- **Sample Data Viewer**: Displays pre-loaded table schemas and sample data
- **SQL Editor**: Monaco Editor with syntax highlighting and autocomplete
- **Results Panel**: Displays query execution results in a formatted table
- **LLM Hint Integration**: "Get Hint" button uses an LLM API to provide guidance (not the full solution)

### 3. Query Execution Engine
- Executes user-submitted SQL queries against PostgreSQL
- Returns results or error messages
- Implements query validation and sanitization for security

---


## ✨ Features

### <i class="ri-graduation-cap-line"></i> Learning Experience
- **Interactive SQL Editor** - Monaco Editor with syntax highlighting, autocomplete, and error detection
- **LeetCode-Style Problems** - Clear problem statements with input tables, expected output, and constraints
- **Multiple Difficulty Levels** - Easy, Medium, and Hard challenges
- **Category-Based Learning** - SELECT, WHERE, JOIN, GROUP BY, SUBQUERY, AGGREGATE, and ADVANCED

### <i class="ri-robot-2-line"></i> AI-Powered Assistance
- **Smart Hints** - Get contextual hints powered by Google Gemini AI
- **Fallback System** - Predefined hints available when AI is unavailable
- **Educational Focus** - Hints guide without giving away solutions

### <i class="ri-bar-chart-box-line"></i> Progress Tracking
- **Completion Status** - Track solved vs unsolved problems
- **Hints Usage** - Monitor how many hints used per problem
- **Performance Metrics** - Time tracking and attempt history

### <i class="ri-shield-keyhole-line"></i> Security
- **JWT Authentication** - Secure user sessions
- **Query Sandboxing** - Only SELECT queries allowed
- **Input Validation** - SQL injection protection
- **Rate Limiting** - API request throttling

### <i class="ri-palette-line"></i> User Interface
- **Dark Theme** - Easy on the eyes for long coding sessions
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Framer Motion powered transitions
- **Remix Icon Library** - Modern icons throughout the UI
- **Toast Notifications** - Real-time feedback on actions

---

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **Vite** | Build Tool & Dev Server |
| **Monaco Editor** | Code Editor (VS Code's editor) |
| **Framer Motion** | Animations |
| **React Router v6** | Client-side Routing |
| **Axios** | HTTP Client |
| **SCSS** | Styling with variables & mixins |
| **React Hot Toast** | Notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime Environment |
| **Express.js** | Web Framework |
| **PostgreSQL** | SQL Query Execution |
| **MongoDB Atlas** | User Data & Assignments |
| **Mongoose** | MongoDB ODM |
| **JWT** | Authentication |
| **bcryptjs** | Password Hashing |
| **Google Gemini** | AI Hints Generation |

---

## 📁 Project Structure

```
CipherSQLStudio/
├── 📁 frontend/                    # React Frontend Application
│   ├── 📁 public/                  # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/          # Reusable UI components
│   │   │   └── 📁 layout/          # Header, Footer components
│   │   ├── 📁 context/             # React Context (Auth)
│   │   ├── 📁 pages/               # Page components
│   │   │   ├── Home.jsx            # Landing page
│   │   │   ├── Login.jsx           # User login
│   │   │   ├── Register.jsx        # User registration
│   │   │   ├── Assignments.jsx     # Problem list
│   │   │   └── Practice.jsx        # SQL Editor & problem solving
│   │   ├── 📁 services/            # API service layer
│   │   │   └── api.js              # Axios configuration
│   │   ├── 📁 styles/              # SCSS stylesheets
│   │   │   ├── 📁 abstracts/       # Variables, mixins, animations
│   │   │   ├── 📁 base/            # Reset, typography, utilities
│   │   │   ├── 📁 components/      # Component styles
│   │   │   ├── 📁 layouts/         # Layout styles
│   │   │   └── 📁 pages/           # Page-specific styles
│   │   ├── App.jsx                 # Root component
│   │   └── main.jsx                # Entry point
│   ├── index.html
│   ├── vite.config.js              # Vite configuration
│   └── package.json
│
├── 📁 backend/                     # Express Backend API
│   ├── 📁 src/
│   │   ├── 📁 config/              # Database configurations
│   │   │   ├── mongodb.js          # MongoDB Atlas connection
│   │   │   └── postgres.js         # PostgreSQL connection pool
│   │   ├── 📁 controllers/         # Route handlers
│   │   │   ├── auth.controller.js  # Authentication logic
│   │   │   ├── assignment.controller.js
│   │   │   ├── query.controller.js # SQL execution
│   │   │   ├── hint.controller.js  # AI hints
│   │   │   └── progress.controller.js
│   │   ├── 📁 middleware/          # Express middleware
│   │   │   ├── auth.middleware.js  # JWT verification
│   │   │   └── validation.middleware.js
│   │   ├── 📁 models/              # Mongoose schemas
│   │   │   ├── User.model.js
│   │   │   ├── Assignment.model.js
│   │   │   └── Progress.model.js
│   │   ├── 📁 routes/              # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── assignment.routes.js
│   │   │   ├── query.routes.js
│   │   │   ├── hint.routes.js
│   │   │   └── progress.routes.js
│   │   ├── 📁 scripts/             # Utility scripts
│   │   │   ├── seedData.js         # Database seeder
│   │   │   ├── checkUsers.js       # Debug users
│   │   │   └── dropIndex.js        # Fix MongoDB indexes
│   │   └── index.js                # Server entry point
│   ├── .env                        # Environment variables
│   └── package.json
│
├── package.json                    # Root workspace config
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** v18+ 
- **npm** v9+
- **PostgreSQL** 15+ (local installation)
- **MongoDB Atlas** account (free tier works)
- **Google AI Studio** API key (for AI hints)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/CipherSQLStudio.git
cd CipherSQLStudio
```

### Step 2: Install Dependencies

```bash
# Install all dependencies (root + frontend + backend)
npm install
```

### Step 3: Configure Environment Variables

Create `.env` file in the `backend/` folder:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# PostgreSQL Configuration
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=your_database_name
PG_USER=postgres
PG_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# Google Gemini API (for AI hints)
GEMINI_API_KEY=your_gemini_api_key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Set Up PostgreSQL Database

1. Open **pgAdmin** or `psql`
2. Create a new database (e.g., `sqlstudio`)
3. Update `PG_DATABASE` in `.env`

### Step 5: Seed the Database

```bash
npm run seed
```

This populates the database with 8 SQL practice problems.

### Step 6: Start the Application

```bash
# Start both frontend and backend
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5001

---

## ⚙️ Configuration

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5001` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `PG_HOST` | PostgreSQL host | `localhost` |
| `PG_PORT` | PostgreSQL port | `5432` |
| `PG_DATABASE` | Database name | `sqlstudio` |
| `PG_USER` | Database user | `postgres` |
| `PG_PASSWORD` | Database password | `your_password` |
| `JWT_SECRET` | Secret for JWT signing | Random 32+ char string |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |

### Getting API Keys

#### Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" → "Create API Key"
4. Copy and add to `.env`

#### MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Create a database user
4. Get connection string from "Connect" → "Connect your application"

---

## 📖 Usage

### User Flow

1. **Register** - Create an account with email/password
2. **Login** - Authenticate to access assignments
3. **Browse** - View all SQL challenges by difficulty/category
4. **Practice** - Select a problem and write SQL queries
5. **Execute** - Run queries against real PostgreSQL database
6. **Get Hints** - Request AI-powered hints when stuck
7. **Complete** - Verify solution matches expected output

### Keyboard Shortcuts (Practice Page)

| Shortcut | Action |
|----------|--------|
| `Ctrl + Enter` | Execute Query |
| `Ctrl + /` | Toggle Comment |
| `Ctrl + Z` | Undo |
| `Ctrl + Shift + Z` | Redo |

---

## 📡 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Assignment Endpoints

#### Get All Assignments
```http
GET /api/assignments
Authorization: Bearer <token>
```

#### Get Single Assignment
```http
GET /api/assignments/:id
Authorization: Bearer <token>
```

### Query Endpoints

#### Execute SQL Query
```http
POST /api/query/execute
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "SELECT * FROM employees",
  "assignmentId": "...",
  "schemaName": "assignment_1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "rows": [...],
    "rowCount": 5,
    "fields": ["id", "name", "department", "salary"]
  }
}
```

### Hint Endpoints

#### Get AI Hint
```http
POST /api/hints
Authorization: Bearer <token>
Content-Type: application/json

{
  "assignmentId": "...",
  "currentQuery": "SELECT * FROM",
  "hintsUsed": 0
}
```

### Progress Endpoints

#### Mark Assignment Complete
```http
POST /api/progress/:assignmentId/complete
Authorization: Bearer <token>

{
  "hintsUsed": 2
}
```

#### Record Hint Usage
```http
POST /api/progress/:assignmentId/hint
Authorization: Bearer <token>
```

---

## 🗄 Database Schema

### MongoDB Collections

#### Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  googleId: String (sparse),
  createdAt: Date,
  updatedAt: Date
}
```

#### Assignments
```javascript
{
  _id: ObjectId,
  title: String,
  difficulty: "Easy" | "Medium" | "Hard",
  category: "SELECT" | "WHERE" | "JOIN" | "GROUP BY" | "SUBQUERY" | "AGGREGATE" | "ADVANCED",
  question: String,
  description: String,
  hints: [String],
  sampleTables: [{
    tableName: String,
    columns: [{ columnName: String, dataType: String }],
    rows: [[Mixed]]
  }],
  expectedOutput: {
    type: "count" | "single_value" | "table",
    value: Mixed
  },
  schemaName: String (unique),
  points: Number,
  timeLimit: Number
}
```

#### Progress
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  assignment: ObjectId (ref: Assignment),
  completed: Boolean,
  hintsUsed: Number,
  attempts: Number,
  completedAt: Date
}
```

### PostgreSQL Structure

Each assignment creates its own schema with tables:

```sql
-- Schema per assignment
CREATE SCHEMA assignment_1;

-- Tables within schema
CREATE TABLE assignment_1.employees (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  department VARCHAR(50),
  salary DECIMAL(10,2),
  hire_date DATE
);
```

---

## 🧪 Sample Problems

The seeded database includes these SQL challenges:

| # | Title | Difficulty | Category |
|---|-------|------------|----------|
| 1 | Select All Employees | Easy | SELECT |
| 2 | Filter by Department | Easy | WHERE |
| 3 | Calculate Average Salary | Medium | AGGREGATE |
| 4 | Join Orders with Customers | Medium | JOIN |
| 5 | Count by Category | Medium | GROUP BY |
| 6 | Find Highest Salary | Medium | SUBQUERY |
| 7 | Complex Join Query | Hard | JOIN |
| 8 | Recursive Query | Hard | ADVANCED |

---

## 🔧 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend & backend in development mode |
| `npm run frontend` | Start only frontend |
| `npm run backend` | Start only backend |
| `npm run seed` | Seed database with sample assignments |
| `npm run build` | Build frontend for production |

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 5001 (Windows)
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

#### MongoDB Connection Failed
- Check if IP is whitelisted in MongoDB Atlas
- Verify connection string in `.env`

#### PostgreSQL Connection Failed
- Ensure PostgreSQL service is running
- Check credentials in `.env`
- Verify database exists

#### Gemini API Quota Exceeded
- Free tier has rate limits (15 req/min)
- Wait 30-60 seconds between hint requests
- Or upgrade to paid plan

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - The code editor that powers VS Code
- [LeetCode](https://leetcode.com/) - Inspiration for the problem format
- [Google Gemini](https://ai.google.dev/) - AI-powered hints
- [Framer Motion](https://www.framer.com/motion/) - Smooth animations

---

<div align="center">

**Made with ❤️ for SQL Learners**

[⬆ Back to Top](#-ciphersqlstudio)

</div>
