import {
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome,
  getUsers,
} from "./api.js";
import { openModal, closeModal } from "./modal.js";

const CATEGORIES = ["Salary", "Freelance", "Investment", "Business", "Other"];

export async function renderIncomePage() {
  const app = document.getElementById("app");
  const users = await getUsers();
  const userOptions = users
    .map((u) => `<option value="${u._id}">${u.name}</option>`)
    .join("");

  app.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Income</h1>
        <p>Track all revenue transactions</p>
      </div>
      <button class="btn btn-primary" id="add-income-btn">+ Add Income</button>
    </div>
    <div class="section-card">
      <div class="table-toolbar">
        <div class="search-input-wrap">
          <span class="search-icon">🔍</span>
          <input type="text" id="income-search" placeholder="Search income..." />
        </div>
        <select class="filter-select" id="income-filter-category">
          <option value="">All Categories</option>
          ${CATEGORIES.map((c) => `<option value="${c}">${c}</option>`).join("")}
        </select>
        <select class="filter-select" id="income-filter-user">
          <option value="">All Users</option>
          ${userOptions}
        </select>
      </div>
      <div id="income-table-wrap"></div>
    </div>
  `;

  await loadIncome();

  document
    .getElementById("add-income-btn")
    .addEventListener("click", () => openAddIncomeModal(userOptions));
  document
    .getElementById("income-search")
    .addEventListener("input", refreshList);
  document
    .getElementById("income-filter-category")
    .addEventListener("change", refreshList);
  document
    .getElementById("income-filter-user")
    .addEventListener("change", refreshList);
}

async function refreshList() {
  const search = document.getElementById("income-search").value.toLowerCase();
  const category = document.getElementById("income-filter-category").value;
  const userId = document.getElementById("income-filter-user").value;
  await loadIncome({ search, category, userId });
}

async function loadIncome({ search = "", category = "", userId = "" } = {}) {
  const wrap = document.getElementById("income-table-wrap");
  let records = await getIncome(userId);

  if (category) records = records.filter((r) => r.category === category);
  if (search)
    records = records.filter(
      (r) =>
        r.category.toLowerCase().includes(search) ||
        (r.description || "").toLowerCase().includes(search)
    );

  if (records.length === 0) {
    wrap.innerHTML =
      "<div class=\"empty-state\"><div class=\"empty-state-icon\">📈</div><p>No income records found.</p></div>";
    return;
  }

  const total = records.reduce((s, r) => s + r.amount, 0);

  wrap.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${records
          .map(
            (r) => `
          <tr>
            <td>${new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
            <td><span class="badge badge-green">${r.category}</span></td>
            <td class="text-muted">${r.description || "—"}</td>
            <td class="amount-positive">+$${r.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
            <td>
              <div class="table-actions">
                <button class="btn btn-secondary btn-sm" onclick="editIncomeModal('${r._id}', ${r.amount}, '${r.category}', '${r.description || ""}', '${r.date}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteIncomeModal('${r._id}')">Delete</button>
              </div>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    <div class="record-count">${records.length} record${records.length !== 1 ? "s" : ""} · Total: <strong class="amount-positive">$${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></div>
  `;
}

function openAddIncomeModal(userOptions) {
  const today = new Date().toISOString().split("T")[0];
  openModal({
    title: "Add Income",
    bodyHTML: `
      <div class="form-grid">
        <div class="form-group full">
          <label>User</label>
          <select id="m-inc-user">
            <option value="">— Select User —</option>
            ${userOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Amount ($)</label>
          <input type="number" id="m-inc-amount" placeholder="0.00" min="0.01" step="0.01" />
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="m-inc-category">
            <option value="">— Select —</option>
            ${CATEGORIES.map((c) => `<option value="${c}">${c}</option>`).join("")}
          </select>
        </div>
        <div class="form-group full">
          <label>Description</label>
          <input type="text" id="m-inc-desc" placeholder="Optional description" />
        </div>
        <div class="form-group full">
          <label>Date</label>
          <input type="date" id="m-inc-date" value="${today}" />
        </div>
        <p class="form-error" id="m-inc-error"></p>
      </div>
    `,
    confirmLabel: "Add Income",
    onConfirm: async () => {
      const userId = document.getElementById("m-inc-user").value;
      const amount = document.getElementById("m-inc-amount").value;
      const category = document.getElementById("m-inc-category").value;
      const description = document.getElementById("m-inc-desc").value.trim();
      const date = document.getElementById("m-inc-date").value;
      const errorEl = document.getElementById("m-inc-error");

      if (!userId || !amount || !category || !date) {
        errorEl.textContent = "User, amount, category, and date are required.";
        return;
      }

      const result = await createIncome({
        userId,
        amount,
        category,
        description,
        date,
      });

      if (result.error) {
        errorEl.textContent = result.error;
        return;
      }

      closeModal();
      await loadIncome();
    },
  });
}

window.editIncomeModal = (id, amount, category, description, date) => {
  const dateStr = new Date(date).toISOString().split("T")[0];
  openModal({
    title: "Edit Income",
    bodyHTML: `
      <div class="form-grid">
        <div class="form-group">
          <label>Amount ($)</label>
          <input type="number" id="m-edit-inc-amount" value="${amount}" step="0.01" />
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="m-edit-inc-category">
            ${CATEGORIES.map((c) => `<option value="${c}" ${c === category ? "selected" : ""}>${c}</option>`).join("")}
          </select>
        </div>
        <div class="form-group full">
          <label>Description</label>
          <input type="text" id="m-edit-inc-desc" value="${description}" />
        </div>
        <div class="form-group full">
          <label>Date</label>
          <input type="date" id="m-edit-inc-date" value="${dateStr}" />
        </div>
        <p class="form-error" id="m-edit-inc-error"></p>
      </div>
    `,
    confirmLabel: "Save Changes",
    onConfirm: async () => {
      const newAmount = document.getElementById("m-edit-inc-amount").value;
      const newCategory = document.getElementById("m-edit-inc-category").value;
      const newDesc = document.getElementById("m-edit-inc-desc").value.trim();
      const newDate = document.getElementById("m-edit-inc-date").value;
      const errorEl = document.getElementById("m-edit-inc-error");

      const result = await updateIncome(id, {
        amount: newAmount,
        category: newCategory,
        description: newDesc,
        date: newDate,
      });

      if (result.error) {
        errorEl.textContent = result.error;
        return;
      }

      closeModal();
      await loadIncome();
    },
  });
};

window.deleteIncomeModal = (id) => {
  openModal({
    title: "Delete Income Record",
    bodyHTML:
      "<p style=\"color:var(--text-muted);font-size:0.9rem;\">Are you sure you want to delete this income record? This action cannot be undone.</p>",
    confirmLabel: "Delete",
    confirmClass: "btn-danger",
    onConfirm: async () => {
      await deleteIncome(id);
      closeModal();
      await loadIncome();
    },
  });
};
