import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getUsers,
} from "./api.js";
import { openModal, closeModal } from "./modal.js";

const CATEGORIES = [
  "Rent",
  "Utilities",
  "Salaries",
  "Supplies",
  "Marketing",
  "Travel",
  "Software",
  "Other",
];

export async function renderExpensesPage() {
  const app = document.getElementById("app");
  const users = await getUsers();
  const userOptions = users
    .map((u) => `<option value="${u._id}">${u.name}</option>`)
    .join("");

  app.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Expenses</h1>
        <p>Track all outgoing transactions</p>
      </div>
      <button class="btn btn-primary" id="add-expense-btn">+ Add Expense</button>
    </div>
    <div class="section-card">
      <div class="table-toolbar">
        <div class="search-input-wrap">
          <span class="search-icon">🔍</span>
          <input type="text" id="expense-search" placeholder="Search expenses..." />
        </div>
        <select class="filter-select" id="expense-filter-category">
          <option value="">All Categories</option>
          ${CATEGORIES.map((c) => `<option value="${c}">${c}</option>`).join("")}
        </select>
        <select class="filter-select" id="expense-filter-user">
          <option value="">All Users</option>
          ${userOptions}
        </select>
      </div>
      <div id="expenses-table-wrap"></div>
    </div>
  `;

  await loadExpenses();

  document
    .getElementById("add-expense-btn")
    .addEventListener("click", () => openAddExpenseModal(userOptions));
  document
    .getElementById("expense-search")
    .addEventListener("input", refreshList);
  document
    .getElementById("expense-filter-category")
    .addEventListener("change", refreshList);
  document
    .getElementById("expense-filter-user")
    .addEventListener("change", refreshList);
}

async function refreshList() {
  const search = document.getElementById("expense-search").value.toLowerCase();
  const category = document.getElementById("expense-filter-category").value;
  const userId = document.getElementById("expense-filter-user").value;
  await loadExpenses({ search, category, userId });
}

async function loadExpenses({ search = "", category = "", userId = "" } = {}) {
  const wrap = document.getElementById("expenses-table-wrap");
  let records = await getExpenses(userId);

  if (category) records = records.filter((r) => r.category === category);
  if (search)
    records = records.filter(
      (r) =>
        r.category.toLowerCase().includes(search) ||
        (r.description || "").toLowerCase().includes(search)
    );

  if (records.length === 0) {
    wrap.innerHTML =
      "<div class=\"empty-state\"><div class=\"empty-state-icon\">📉</div><p>No expense records found.</p></div>";
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
            <td><span class="badge badge-red">${r.category}</span></td>
            <td class="text-muted">${r.description || "—"}</td>
            <td class="amount-negative">-$${r.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
            <td>
              <div class="table-actions">
                <button class="btn btn-secondary btn-sm" onclick="editExpenseModal('${r._id}', ${r.amount}, '${r.category}', '${r.description || ""}', '${r.date}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteExpenseModal('${r._id}')">Delete</button>
              </div>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    <div class="record-count">${records.length} record${records.length !== 1 ? "s" : ""} · Total: <strong class="amount-negative">$${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></div>
  `;
}

function openAddExpenseModal(userOptions) {
  const today = new Date().toISOString().split("T")[0];
  openModal({
    title: "Add Expense",
    bodyHTML: `
      <div class="form-grid">
        <div class="form-group full">
          <label>User</label>
          <select id="m-exp-user">
            <option value="">— Select User —</option>
            ${userOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Amount ($)</label>
          <input type="number" id="m-exp-amount" placeholder="0.00" min="0.01" step="0.01" />
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="m-exp-category">
            <option value="">— Select —</option>
            ${CATEGORIES.map((c) => `<option value="${c}">${c}</option>`).join("")}
          </select>
        </div>
        <div class="form-group full">
          <label>Description</label>
          <input type="text" id="m-exp-desc" placeholder="Optional description" />
        </div>
        <div class="form-group full">
          <label>Date</label>
          <input type="date" id="m-exp-date" value="${today}" />
        </div>
        <p class="form-error" id="m-exp-error"></p>
      </div>
    `,
    confirmLabel: "Add Expense",
    onConfirm: async () => {
      const userId = document.getElementById("m-exp-user").value;
      const amount = document.getElementById("m-exp-amount").value;
      const category = document.getElementById("m-exp-category").value;
      const description = document.getElementById("m-exp-desc").value.trim();
      const date = document.getElementById("m-exp-date").value;
      const errorEl = document.getElementById("m-exp-error");

      if (!userId || !amount || !category || !date) {
        errorEl.textContent = "User, amount, category, and date are required.";
        return;
      }

      const result = await createExpense({
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
      await loadExpenses();
    },
  });
}

window.editExpenseModal = (id, amount, category, description, date) => {
  const dateStr = new Date(date).toISOString().split("T")[0];
  openModal({
    title: "Edit Expense",
    bodyHTML: `
      <div class="form-grid">
        <div class="form-group">
          <label>Amount ($)</label>
          <input type="number" id="m-edit-exp-amount" value="${amount}" step="0.01" />
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="m-edit-exp-category">
            ${CATEGORIES.map((c) => `<option value="${c}" ${c === category ? "selected" : ""}>${c}</option>`).join("")}
          </select>
        </div>
        <div class="form-group full">
          <label>Description</label>
          <input type="text" id="m-edit-exp-desc" value="${description}" />
        </div>
        <div class="form-group full">
          <label>Date</label>
          <input type="date" id="m-edit-exp-date" value="${dateStr}" />
        </div>
        <p class="form-error" id="m-edit-exp-error"></p>
      </div>
    `,
    confirmLabel: "Save Changes",
    onConfirm: async () => {
      const newAmount = document.getElementById("m-edit-exp-amount").value;
      const newCategory = document.getElementById("m-edit-exp-category").value;
      const newDesc = document.getElementById("m-edit-exp-desc").value.trim();
      const newDate = document.getElementById("m-edit-exp-date").value;
      const errorEl = document.getElementById("m-edit-exp-error");

      const result = await updateExpense(id, {
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
      await loadExpenses();
    },
  });
};

window.deleteExpenseModal = (id) => {
  openModal({
    title: "Delete Expense Record",
    bodyHTML:
      "<p style=\"color:var(--text-muted);font-size:0.9rem;\">Are you sure you want to delete this expense record? This action cannot be undone.</p>",
    confirmLabel: "Delete",
    confirmClass: "btn-danger",
    onConfirm: async () => {
      await deleteExpense(id);
      closeModal();
      await loadExpenses();
    },
  });
};
