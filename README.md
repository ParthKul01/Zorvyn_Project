# Zorvyn Finance Backend (Node + Express + MongoDB Atlas)

Backend service for the Zorvyn finance application.  
Provides APIs to manage financial records and compute summary insights, secured with simple role-based access via headers.

## Tech Stack

- Node.js 20.x
- Express 5
- MongoDB Atlas (official `mongodb` driver)
- Dotenv for configuration

## Getting Started

### 1. Install dependencies

```bash
cd finance-backend
npm install
```

### 2. Environment variables

Create a `.env` file in `finance-backend` (already present in this project) with:

```bash
MONGO_URL=YOUR_MONGODB_ATLAS_URI
PORT=3000
```

In your project this URL is already set; keep it as-is unless you change clusters.

### 3. Run the server

```bash
# Development with auto-restart
npm run dev

# Or plain Node
npm start
```

The backend will start on `http://localhost:3000` (or the `PORT` you set).

On startup the app:

- Connects to MongoDB Atlas using `MONGO_URL`
- Uses database `zorvyn_finance`
- Ensures a default admin user exists:
  - `username: "admin_user"`
  - `role: "ADMIN"`
  - `status: "active"`

## API Overview

Base URL:

```text
http://localhost:3000/api
```

All protected routes expect the header:

```text
x-user-role: ADMIN | ANALYST | VIEWER
```

### Roles and Permissions

- **ADMIN**: `create_user`, `manage_user`, `create_record`, `update_record`, `delete_record`, `view_all`
- **ANALYST**: `view_all`, `view_insights`
- **VIEWER**: `view_all`

### Endpoints

#### POST `/api/records`  (Admin only)

Create a new financial record.

**Headers**

- `x-user-role: ADMIN`

**Body (JSON)**

```json
{
  "amount": 2500,
  "type": "income", 
  "category": "Salary",
  "date": "2025-01-01",
  "description": "January salary"
}
```

**Response**

```json
{
  "id": "MongoDB ObjectId..."
}
```

#### GET `/api/records`  (All roles)

Returns all stored records.

**Headers**

- `x-user-role: ADMIN | ANALYST | VIEWER`

**Response Example**

```json
[
  {
    "_id": "651...",
    "amount": 2500,
    "type": "income",
    "category": "Salary",
    "date": "2025-01-01T00:00:00.000Z",
    "description": "January salary"
  }
]
```

#### GET `/api/summary`  (Analyst + Admin)

Returns aggregated financial summary.

**Headers**

- `x-user-role: ADMIN | ANALYST`

**Response Shape**

```json
{
  "totalIncome": 5000,
  "totalExpenses": 2000,
  "netBalance": 3000,
  "categoryBreakdown": [
    {
      "category": "Salary",
      "total": 5000,
      "count": 2
    }
  ]
}
```

## Built-in API Testing Page

A minimal front-end test console is served directly from the backend.

- Open: `http://localhost:3000/`
- Features:
  - Set `x-user-role` (ADMIN / ANALYST / VIEWER)
  - Call:
    - `POST /api/records`
    - `GET /api/records`
    - `GET /api/summary`
  - View formatted JSON responses, HTTP status, and latency

This page lives in `public/index.html` and is served by:

```js
app.use(express.static(path.join(__dirname, 'public')));
```

## Project Structure

```text
finance-backend/
├─ app.js                # Express app + MongoDB connection bootstrap
├─ .env                  # Environment variables (MONGO_URL, PORT)
├─ public/
│  └─ index.html         # API testing console (served at /)
└─ src/
   ├─ config/
   │  └─ database.js     # MongoDB connection + seed admin user
   ├─ middleware/
   │  └─ auth.js         # Role-based authorization via x-user-role
   ├─ routes/
   │  └─ financeRoutes.js# Record + summary routes
   └─ services/
      └─ financeService.js # Aggregation logic for /summary
```

## Notes

- This is a simple demo-style backend: there is no authentication/JWT, only header-based role simulation.
- Data is stored in MongoDB Atlas; ensure IP access rules and credentials are correctly configured in your Atlas project.

