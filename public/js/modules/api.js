const BASE = "/api";

// ── Users ──────────────────────────────────────────────
export async function createUser(data) {
  const res = await fetch(`${BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getUsers() {
  const res = await fetch(`${BASE}/users`);
  return res.json();
}

export async function getUserById(id) {
  const res = await fetch(`${BASE}/users/${id}`);
  return res.json();
}

export async function updateUser(id, data) {
  const res = await fetch(`${BASE}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE}/users/${id}`, { method: "DELETE" });
  return res.json();
}

// ── Income ─────────────────────────────────────────────
export async function createIncome(data) {
  const res = await fetch(`${BASE}/income`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getIncome(userId = "") {
  const url = userId ? `${BASE}/income?userId=${userId}` : `${BASE}/income`;
  const res = await fetch(url);
  return res.json();
}

export async function updateIncome(id, data) {
  const res = await fetch(`${BASE}/income/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteIncome(id) {
  const res = await fetch(`${BASE}/income/${id}`, { method: "DELETE" });
  return res.json();
}

// ── Expenses ───────────────────────────────────────────
export async function createExpense(data) {
  const res = await fetch(`${BASE}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getExpenses(userId = "") {
  const url = userId ? `${BASE}/expenses?userId=${userId}` : `${BASE}/expenses`;
  const res = await fetch(url);
  return res.json();
}

export async function updateExpense(id, data) {
  const res = await fetch(`${BASE}/expenses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteExpense(id) {
  const res = await fetch(`${BASE}/expenses/${id}`, { method: "DELETE" });
  return res.json();
}
