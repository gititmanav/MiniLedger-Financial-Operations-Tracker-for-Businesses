import { getUsers, createUser, updateUser, deleteUser } from "./api.js";
import { openModal, closeModal } from "./modal.js";

export async function renderUsersPage() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Users</h1>
        <p>Manage registered accounts</p>
      </div>
      <button class="btn btn-primary" id="add-user-btn">+ Add User</button>
    </div>
    <div class="section-card">
      <div class="table-toolbar">
        <div class="search-input-wrap">
          <span class="search-icon">🔍</span>
          <input type="text" id="user-search" placeholder="Search users..." />
        </div>
      </div>
      <div id="users-table-wrap"></div>
    </div>
  `;

  await loadUsers();
  document
    .getElementById("add-user-btn")
    .addEventListener("click", () => openAddUserModal());
  document
    .getElementById("user-search")
    .addEventListener("input", async (e) => {
      await loadUsers(e.target.value);
    });
}

async function loadUsers(search = "") {
  const wrap = document.getElementById("users-table-wrap");
  let users = await getUsers();

  if (search) {
    const q = search.toLowerCase();
    users = users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  if (users.length === 0) {
    wrap.innerHTML =
      "<div class=\"empty-state\"><div class=\"empty-state-icon\">👤</div><p>No users found.</p></div>";
    return;
  }

  wrap.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${users
          .map(
            (u) => `
          <tr>
            <td><strong>${u.name}</strong></td>
            <td class="text-muted">${u.email}</td>
            <td class="text-muted">${u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
            <td>
              <div class="table-actions">
                <button class="btn btn-secondary btn-sm" onclick="editUserModal('${u._id}', '${u.name}', '${u.email}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUserModal('${u._id}', '${u.name}')">Delete</button>
              </div>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    <div class="record-count">${users.length} user${users.length !== 1 ? "s" : ""}</div>
  `;
}

function openAddUserModal() {
  openModal({
    title: "Add New User",
    bodyHTML: `
      <div class="form-grid">
        <div class="form-group full">
          <label>Full Name</label>
          <input type="text" id="m-user-name" placeholder="Enter full name" />
        </div>
        <div class="form-group full">
          <label>Email Address</label>
          <input type="email" id="m-user-email" placeholder="Enter email" />
        </div>
        <div class="form-group full">
          <label>Password</label>
          <input type="password" id="m-user-password" placeholder="Enter password" />
        </div>
        <p class="form-error" id="m-user-error"></p>
      </div>
    `,
    confirmLabel: "Add User",
    onConfirm: async () => {
      const name = document.getElementById("m-user-name").value.trim();
      const email = document.getElementById("m-user-email").value.trim();
      const password = document.getElementById("m-user-password").value.trim();
      const errorEl = document.getElementById("m-user-error");

      if (!name || !email || !password) {
        errorEl.textContent = "All fields are required.";
        return;
      }

      const result = await createUser({ name, email, password });

      if (result.error) {
        errorEl.textContent = result.error;
        return;
      }

      closeModal();
      await loadUsers();
    },
  });
}

window.editUserModal = (id, name, email) => {
  openModal({
    title: "Edit User",
    bodyHTML: `
      <div class="form-grid">
        <div class="form-group full">
          <label>Full Name</label>
          <input type="text" id="m-edit-name" value="${name}" />
        </div>
        <div class="form-group full">
          <label>Email Address</label>
          <input type="email" id="m-edit-email" value="${email}" />
        </div>
        <p class="form-error" id="m-edit-error"></p>
      </div>
    `,
    confirmLabel: "Save Changes",
    onConfirm: async () => {
      const newName = document.getElementById("m-edit-name").value.trim();
      const newEmail = document.getElementById("m-edit-email").value.trim();
      const errorEl = document.getElementById("m-edit-error");

      if (!newName || !newEmail) {
        errorEl.textContent = "Name and email are required.";
        return;
      }

      const result = await updateUser(id, { name: newName, email: newEmail });

      if (result.error) {
        errorEl.textContent = result.error;
        return;
      }

      closeModal();
      await loadUsers();
    },
  });
};

window.deleteUserModal = (id, name) => {
  openModal({
    title: "Delete User",
    bodyHTML: `<p style="color:var(--text-muted);font-size:0.9rem;">Are you sure you want to delete <strong style="color:var(--text)">${name}</strong>? This action cannot be undone.</p>`,
    confirmLabel: "Delete",
    confirmClass: "btn-danger",
    onConfirm: async () => {
      await deleteUser(id);
      closeModal();
      await loadUsers();
    },
  });
};
