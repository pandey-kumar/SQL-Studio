# 🗺️ CipherSQLStudio Data Flow Diagram

## Overview
This document describes the end-to-end data flow for CipherSQLStudio, covering user interactions, frontend/backend communication, database access, and AI-powered hint integration.

---

## 1. High-Level Architecture

```
User (Browser)
   |
   v
Frontend (Vite/React)
   |
   v
Backend API (Express on Vercel)
  /   |   \
 /    |    \
PostgreSQL  MongoDB  Google Gemini API
```

---

## 2. Detailed Data Flow Steps

### A. Assignment Listing & Selection
1. **User** opens the app and navigates to the Assignments page.
2. **Frontend** sends a GET request to `/api/assignments`.
3. **Backend** queries **MongoDB** for assignment metadata.
4. **Backend** returns a list of assignments (title, difficulty, description, etc.) to the frontend.
5. **Frontend** displays the assignments for user selection.

### B. Assignment Attempt & Practice
1. **User** selects an assignment to attempt.
2. **Frontend** requests assignment details and sample data from `/api/assignments/:id`.
3. **Backend** fetches assignment details and sample tables from **MongoDB**.
4. **Frontend** displays the question, requirements, and sample data.

### C. SQL Query Execution
1. **User** writes a SQL query in the Monaco Editor and clicks "Run".
2. **Frontend** sends a POST request to `/api/query/execute` with the query, assignmentId, and schemaName.
3. **Backend** validates and sanitizes the query.
4. **Backend** connects to **PostgreSQL** and executes the query in the assignment's schema.
5. **Backend** returns the results (or error) to the frontend.
6. **Frontend** displays the results in a formatted table.

### D. AI-Powered Hint Request
1. **User** clicks the "Get Hint" button.
2. **Frontend** sends a POST request to `/api/hints` with the assignmentId, currentQuery, and hintsUsed.
3. **Backend** sends the request to **Google Gemini API** (LLM) with context.
4. **Gemini API** returns a contextual hint (not a solution).
5. **Backend** returns the hint to the frontend.
6. **Frontend** displays the hint to the user.

### E. Progress Tracking
1. **User** completes an assignment or uses a hint.
2. **Frontend** sends a POST request to `/api/progress/:assignmentId/complete` or `/api/progress/:assignmentId/hint`.
3. **Backend** updates the user's progress in **MongoDB**.
4. **Frontend** updates the UI to reflect progress.

---

## 3. Sequence Diagram (Textual)

```
User -> Frontend: Selects assignment, writes query, requests hint
Frontend -> Backend: API requests (/api/assignments, /api/query/execute, /api/hints, /api/progress)
Backend -> MongoDB: Assignment/user/progress data
Backend -> PostgreSQL: Query execution
Backend -> Gemini API: Hint generation
MongoDB/PostgreSQL/Gemini -> Backend: Data/results/hint
Backend -> Frontend: JSON responses
Frontend -> User: Rendered UI, results, hints
```

---

## 4. Mermaid Diagram

```mermaid
flowchart TD
    A[User (Browser)] 
    B[Frontend (Vite/React)]
    C[Backend API (Express/Vercel Serverless)]
    D[PostgreSQL (Assignments Data)]
    E[MongoDB Atlas (Users, Progress, Assignments)]
    F[Google Gemini API (LLM Hints)]

    A -- UI Actions --> B
    B -- HTTP (fetch/axios) --> C
    C -- SQL Query --> D
    C -- Mongoose Query --> E
    C -- HTTP (AI Hint) --> F
    D -- Results --> C
    E -- Data --> C
    F -- Hint --> C
    C -- JSON Response --> B
    B -- Rendered UI --> A
```

---

## 5. Key Endpoints

- `/api/assignments` — List/fetch assignments (MongoDB)
- `/api/query/execute` — Run SQL query (PostgreSQL)
- `/api/hints` — Get AI-powered hint (Google Gemini)
- `/api/auth` — User authentication (MongoDB)
- `/api/progress` — Track user progress (MongoDB)

---

## 6. Notes
- All API requests from the frontend use `/api` as the base path.
- Vercel routes `/api/*` to the backend serverless function.
- All environment variables for DB/API keys must be set in Vercel dashboard.
- The system is designed for security: only SELECT queries are allowed, and all user input is validated.
