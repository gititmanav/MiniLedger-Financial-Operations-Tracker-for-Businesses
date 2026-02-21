import { renderHomePage } from "./homePage.js";
import { renderUsersPage } from "./usersPage.js";
import { renderIncomePage } from "./incomePage.js";
import { renderExpensesPage } from "./expensesPage.js";

const routes = {
  "#home": renderHomePage,
  "#users": renderUsersPage,
  "#income": renderIncomePage,
  "#expenses": renderExpensesPage,
};

export function initRouter() {
  window.addEventListener("hashchange", navigate);
  navigate();
}

function navigate() {
  const hash = window.location.hash || "#home";
  const render = routes[hash] || renderHomePage;
  render();
}
