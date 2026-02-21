# MiniLedger – Financial Operations Tracker

![MiniLedger Dashboard](screenshots/dashboard.png)

## Author

- **Manav Kaneria** – [GitHub](https://github.com/manavkaneria)
- **Tisha Anil Patel** – [GitHub](https://github.com/tishapatel)

## Class Link

[CS5610 Web Development – Northeastern University](https://neu.edu)

---

## Project Objective

MiniLedger is a browser-based financial operations platform designed for small businesses, freelancers, and independent operators who need a lightweight alternative to complex accounting software.

The application enables users to record and manage income and expense transactions, categorize cash flows, filter records by user or category, and instantly view financial summaries — including net balance, total revenue, total outgoing payments, and a 6-month income vs. expense trend chart — all without any page reloads.

The backend is built on Node.js and Express using ES Modules, with MongoDB (native driver) handling data persistence and aggregation. The frontend is entirely client-side rendered using Vanilla ES6 modules with no frameworks, no templating engines, and no build tools.

---

## Tech Stack

| Layer             | Technology                                  |
| ----------------- | ------------------------------------------- |
| Runtime           | Node.js v18+                                |
| Backend Framework | Express.js (ESM)                            |
| Database          | MongoDB Atlas (native driver, no Mongoose)  |
| Frontend          | Vanilla ES6 Modules (client-side rendering) |
| Charts            | Chart.js (CDN)                              |
| Styling           | Plain CSS Modules (one file per component)  |
| Linting           | ESLint v9 (flat config)                     |
| Formatting        | Prettier                                    |

---

## Features

### Dashboard

- Real-time summary cards: Total Income, Total Expenses, Net Balance, Total Users
- Bar chart showing Income vs Expenses over the last 6 months
- Doughnut chart showing expense breakdown by category
- Recent transactions table combining income and expenses

### Income Module

- Create, read, update, delete income transactions via modal forms
- Filter by category (Salary, Freelance, Investment, Business, Other)
- Filter by user
- Live search across category and description
- Record count and running total shown at the bottom of the table

### Expense Module

- Create, read, update, delete expense transactions via modal forms
- Filter by category (Rent, Utilities, Salaries, Supplies, Marketing, Travel, Software, Other)
- Filter by user
- Live search across category and description
- Record count and running total shown at the bottom of the table

### User Management

- Register new users with name, email, and password
- Edit existing user details
- Delete users
- Live search by name or email

### General

- Modal-based forms for all create and edit operations (no page jumps)
- Confirm dialogs for all delete operations
- Sidebar navigation with active state highlighting
- Responsive layout with sticky topbar
- Clean fintech-style UI (Plus Jakarta Sans, indigo/emerald/rose palette)

---

## Project Structure

```
miniledger/
├── public/
│   ├── css/
│   │   ├── base.css          # Global variables, resets, utility classes
│   │   ├── layout.css        # App shell, sidebar, topbar, page layout
│   │   ├── nav.css           # Sidebar and topbar styles
│   │   ├── forms.css         # Form inputs, labels, buttons
│   │   ├── modal.css         # Modal overlay and dialog styles
│   │   ├── transactions.css  # Tables, filters, search toolbar
│   │   └── dashboard.css     # Stat cards, chart cards, dashboard grid
│   ├── js/
│   │   ├── app.js            # Entry point — initializes nav and router
│   │   └── modules/
│   │       ├── api.js        # All fetch() calls to the backend API
│   │       ├── router.js     # Hash-based client-side router
│   │       ├── nav.js        # Renders sidebar and topbar
│   │       ├── modal.js      # Reusable modal open/close logic
│   │       ├── homePage.js   # Dashboard page with charts and summary
│   │       ├── usersPage.js  # User management page
│   │       ├── incomePage.js # Income transactions page
│   │       └── expensesPage.js # Expense transactions page
│   └── index.html            # Single HTML shell — all content rendered by JS
├── src/
│   ├── db/
│   │   └── connection.js     # MongoDB connection module (connectDB, getDB)
│   ├── routes/
│   │   ├── users.js          # REST endpoints: /api/users
│   │   ├── income.js         # REST endpoints: /api/income
│   │   └── expenses.js       # REST endpoints: /api/expenses
│   └── seed.js               # Seeds 1,100+ sample records into MongoDB
├── .env.example              # Environment variable template (safe to commit)
├── eslint.config.js          # ESLint v9 flat config
├── .prettierrc               # Prettier formatting rules
├── .gitignore                # Excludes node_modules and .env
├── server.js                 # Express app entry point
├── package.json              # Dependencies and npm scripts
├── LICENSE                   # MIT License
└── README.md
```

---

## API Endpoints

### Users

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| GET    | `/api/users`     | Get all users   |
| GET    | `/api/users/:id` | Get single user |
| POST   | `/api/users`     | Create user     |
| PUT    | `/api/users/:id` | Update user     |
| DELETE | `/api/users/:id` | Delete user     |

### Income

| Method | Endpoint          | Description                          |
| ------ | ----------------- | ------------------------------------ |
| GET    | `/api/income`     | Get all income (optional `?userId=`) |
| GET    | `/api/income/:id` | Get single record                    |
| POST   | `/api/income`     | Create income record                 |
| PUT    | `/api/income/:id` | Update income record                 |
| DELETE | `/api/income/:id` | Delete income record                 |

### Expenses

| Method | Endpoint            | Description                            |
| ------ | ------------------- | -------------------------------------- |
| GET    | `/api/expenses`     | Get all expenses (optional `?userId=`) |
| GET    | `/api/expenses/:id` | Get single record                      |
| POST   | `/api/expenses`     | Create expense record                  |
| PUT    | `/api/expenses/:id` | Update expense record                  |
| DELETE | `/api/expenses/:id` | Delete expense record                  |

---

## Instructions to Build

### Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account (free tier works fine)

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/miniledger.git
cd miniledger
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
```

Open `.env` and fill in your MongoDB Atlas connection string:

```
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/miniledger?retryWrites=true&w=majority
```

4. **Seed the database** _(optional — inserts 1,100+ sample records for testing)_

```bash
node src/seed.js
```

5. **Start the development server**

```bash
npm run dev
```

Or for production:

```bash
npm start
```

6. **Open in browser**

```
http://localhost:3000
```

### Linting and Formatting

```bash
npm run lint       # Check for ESLint errors
npm run format     # Auto-format all files with Prettier
```

---

## Deployment

Live at: **[https://miniledger-financial-operations-tracker.onrender.com](https://miniledger-financial-operations-tracker.onrender.com)**

Deployed on [Render](https://render.com) as a Node.js web service. Environment variables (`MONGO_URI`, `PORT`) are configured in the Render dashboard and never committed to the repository.

---

## Demo Video

https://youtu.be/UFSLUXuaihw

---

## AI Disclosure

GitHub Copilot and Claude (Anthropic) were used to assist with boilerplate generation, debugging, and code structure suggestions. All architecture decisions, feature design, and final implementation were authored and reviewed by the team.

---

## License

[MIT](LICENSE)
