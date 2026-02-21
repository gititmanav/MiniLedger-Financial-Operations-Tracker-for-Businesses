# MiniLedger – Financial Operations Tracker

![MiniLedger Dashboard](screenshot.png)

## Author

- **Manav Kaneria** – [GitHub](https://github.com/manavkaneria)
- **Tisha Anil Patel** – [GitHub](https://github.com/tishapatel)

## Class Link

[CS5610 Web Development – Northeastern University](https://neu.edu)

## Project Objective

MiniLedger is a browser-based financial operations platform for small businesses and independent operators. It enables users to track income and expenses, categorize transactions, and view real-time financial summaries including balance, total revenue, total expenses, and trend charts — all without any page reloads.

Built with Node.js + Express backend, MongoDB (native driver), and Vanilla ES6 client-side rendering.

## Tech Stack

- **Backend:** Node.js, Express (ESM)
- **Database:** MongoDB (native driver — no Mongoose)
- **Frontend:** Vanilla ES6 modules, client-side rendering
- **Charts:** Chart.js (CDN)
- **Styling:** Plain CSS modules

## Features

- 📊 Dashboard with income vs expense trend charts and net balance
- 💰 Full CRUD for income transactions with search and category filter
- 💸 Full CRUD for expense transactions with search and category filter
- 👤 User management with create, edit, delete
- 🔍 Real-time search and filter on all tables
- 📋 Modal forms for all create/edit operations
- 🌐 Fully deployed on Render

## Project Structure

```
miniledger/
├── public/
│   ├── css/
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── nav.css
│   │   ├── forms.css
│   │   ├── modal.css
│   │   ├── transactions.css
│   │   └── dashboard.css
│   ├── js/
│   │   ├── app.js
│   │   └── modules/
│   │       ├── api.js
│   │       ├── router.js
│   │       ├── nav.js
│   │       ├── modal.js
│   │       ├── homePage.js
│   │       ├── usersPage.js
│   │       ├── incomePage.js
│   │       └── expensesPage.js
│   └── index.html
├── src/
│   ├── db/
│   │   └── connection.js
│   ├── routes/
│   │   ├── users.js
│   │   ├── income.js
│   │   └── expenses.js
│   └── seed.js
├── .env.example
├── .eslintrc.config.js
├── .prettierrc
├── .gitignore
├── server.js
├── package.json
└── README.md
```

## Instructions to Build

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier works)

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

Edit `.env` and add your MongoDB connection string:

```
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/miniledger
```

4. **Seed the database (optional — adds 1,100+ sample records)**

```bash
node src/seed.js
```

5. **Start the server**

```bash
npm start
```

6. **Open in browser**

```
http://localhost:3000
```

## Deployment

Live at: **[https://miniledger.onrender.com](https://miniledger.onrender.com)**

## Demo Video

[Watch on YouTube/Loom](https://your-video-link-here)

## AI Disclosure

GitHub Copilot and Claude (Anthropic) were used to assist with boilerplate generation, debugging, and code structure suggestions. All architecture decisions, logic, and implementation were reviewed and written by the team.

## License

[MIT](LICENSE)
