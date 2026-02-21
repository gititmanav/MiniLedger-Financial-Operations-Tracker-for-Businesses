import { getIncome, getExpenses, getUsers } from "./api.js";

export async function renderHomePage() {
  const app = document.getElementById("app");
  app.innerHTML = "<div class=\"dashboard-loading\">Loading dashboard...</div>";

  const [incomeData, expenseData, usersData] = await Promise.all([
    getIncome(),
    getExpenses(),
    getUsers(),
  ]);

  const totalIncome = incomeData.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = expenseData.reduce((sum, r) => sum + r.amount, 0);
  const balance = totalIncome - totalExpenses;

  const recentAll = [
    ...incomeData.map((r) => ({ ...r, type: "income" })),
    ...expenseData.map((r) => ({ ...r, type: "expense" })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  app.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card income">
        <div class="stat-icon">↑</div>
        <div class="stat-label">Total Income</div>
        <div class="stat-value amount-positive">$${totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div class="stat-sub">${incomeData.length} transactions</div>
      </div>
      <div class="stat-card expense">
        <div class="stat-icon">↓</div>
        <div class="stat-label">Total Expenses</div>
        <div class="stat-value amount-negative">$${totalExpenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div class="stat-sub">${expenseData.length} transactions</div>
      </div>
      <div class="stat-card balance">
        <div class="stat-icon">◎</div>
        <div class="stat-label">Net Balance</div>
        <div class="stat-value ${balance >= 0 ? "amount-positive" : "amount-negative"}">$${Math.abs(balance).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div class="stat-sub">${balance >= 0 ? "Surplus" : "Deficit"}</div>
      </div>
      <div class="stat-card users">
        <div class="stat-icon">◉</div>
        <div class="stat-label">Total Users</div>
        <div class="stat-value">${usersData.length}</div>
        <div class="stat-sub">registered accounts</div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-card-header">
          <h3>Income vs Expenses — Last 6 Months</h3>
        </div>
        <div class="chart-canvas-wrap">
          <canvas id="trend-chart"></canvas>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-card-header">
          <h3>Expense Breakdown</h3>
        </div>
        <div class="chart-canvas-wrap">
          <canvas id="donut-chart"></canvas>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="section-card-header">
        <h2>Recent Transactions</h2>
        <span class="badge badge-gray">${recentAll.length} records</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${recentAll
            .map(
              (r) => `
            <tr>
              <td>${new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
              <td><span class="badge ${r.type === "income" ? "badge-green" : "badge-red"}">${r.type}</span></td>
              <td>${r.category}</td>
              <td class="text-muted">${r.description || "—"}</td>
              <td class="${r.type === "income" ? "amount-positive" : "amount-negative"}">
                ${r.type === "income" ? "+" : "-"}$${r.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;

  renderCharts(incomeData, expenseData);
}

function renderCharts(incomeData, expenseData) {
  const months = [];
  const incomeByMonth = [];
  const expenseByMonth = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
    months.push(label);

    const monthIncome = incomeData
      .filter((r) => {
        const rd = new Date(r.date);
        return (
          rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear()
        );
      })
      .reduce((s, r) => s + r.amount, 0);

    const monthExpense = expenseData
      .filter((r) => {
        const rd = new Date(r.date);
        return (
          rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear()
        );
      })
      .reduce((s, r) => s + r.amount, 0);

    incomeByMonth.push(monthIncome);
    expenseByMonth.push(monthExpense);
  }

  new Chart(document.getElementById("trend-chart"), {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: "Income",
          data: incomeByMonth,
          backgroundColor: "rgba(16,185,129,0.15)",
          borderColor: "#10b981",
          borderWidth: 2,
          borderRadius: 6,
        },
        {
          label: "Expenses",
          data: expenseByMonth,
          backgroundColor: "rgba(244,63,94,0.1)",
          borderColor: "#f43f5e",
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: { family: "Plus Jakarta Sans", size: 11 },
            boxWidth: 12,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: "Plus Jakarta Sans", size: 11 } },
        },
        y: {
          grid: { color: "#f1f5f9" },
          ticks: {
            font: { family: "Plus Jakarta Sans", size: 11 },
            callback: (v) => "$" + v.toLocaleString(),
          },
        },
      },
    },
  });

  const expenseCats = {};
  expenseData.forEach((r) => {
    expenseCats[r.category] = (expenseCats[r.category] || 0) + r.amount;
  });

  const catColors = [
    "#f43f5e",
    "#f97316",
    "#f59e0b",
    "#10b981",
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
  ];

  new Chart(document.getElementById("donut-chart"), {
    type: "doughnut",
    data: {
      labels: Object.keys(expenseCats),
      datasets: [
        {
          data: Object.values(expenseCats),
          backgroundColor: catColors,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font: { family: "Plus Jakarta Sans", size: 10 },
            boxWidth: 10,
            padding: 8,
          },
        },
      },
    },
  });
}
