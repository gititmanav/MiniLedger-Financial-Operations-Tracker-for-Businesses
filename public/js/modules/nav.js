export function renderNav() {
  const sidebar = document.getElementById("sidebar");
  const topbar = document.getElementById("topbar");

  sidebar.innerHTML = `
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon">💰</div>
      <div>
        <div class="sidebar-logo-text">MiniLedger</div>
        <div class="sidebar-logo-sub">Financial Tracker</div>
      </div>
    </div>
    <span class="sidebar-section-label">Overview</span>
    <ul class="sidebar-nav">
      <li>
        <a href="#home" data-route="home">
          <span class="nav-icon">▦</span> Dashboard
        </a>
      </li>
    </ul>
    <span class="sidebar-section-label">Transactions</span>
    <ul class="sidebar-nav">
      <li>
        <a href="#income" data-route="income">
          <span class="nav-icon">↑</span> Income
        </a>
      </li>
      <li>
        <a href="#expenses" data-route="expenses">
          <span class="nav-icon">↓</span> Expenses
        </a>
      </li>
    </ul>
    <span class="sidebar-section-label">Management</span>
    <ul class="sidebar-nav">
      <li>
        <a href="#users" data-route="users">
          <span class="nav-icon">◉</span> Users
        </a>
      </li>
    </ul>
    <div style="flex:1"></div>
    <div class="sidebar-footer">
      <div class="sidebar-footer-text">MiniLedger v1.0</div>
    </div>
  `;

  const now = new Date();
  topbar.innerHTML = `
    <span class="topbar-breadcrumb" id="topbar-title">Dashboard</span>
    <div class="topbar-right">
      <span class="topbar-date">${now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
    </div>
  `;

  updateActiveNav();
  window.addEventListener("hashchange", updateActiveNav);
}

function updateActiveNav() {
  const hash = window.location.hash.replace("#", "") || "home";
  const titles = {
    home: "Dashboard",
    income: "Income",
    expenses: "Expenses",
    users: "Users",
  };

  document.querySelectorAll(".sidebar-nav a").forEach((a) => {
    a.classList.toggle("active", a.dataset.route === hash);
  });

  const titleEl = document.getElementById("topbar-title");
  if (titleEl) titleEl.textContent = titles[hash] || "Dashboard";
}
