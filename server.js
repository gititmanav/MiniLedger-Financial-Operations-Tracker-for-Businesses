import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/db/connection.js";
import usersRouter from "./src/routes/users.js";
import incomeRouter from "./src/routes/income.js";
import expensesRouter from "./src/routes/expenses.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/users", usersRouter);
app.use("/api/income", incomeRouter);
app.use("/api/expenses", expensesRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`MiniLedger server running on http://localhost:${PORT}`);
  });
});
