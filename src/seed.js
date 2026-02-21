import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Business",
  "Other",
];
const EXPENSE_CATEGORIES = [
  "Rent",
  "Utilities",
  "Salaries",
  "Supplies",
  "Marketing",
  "Travel",
  "Software",
  "Other",
];

const INCOME_DESCRIPTIONS = [
  "Monthly salary payment",
  "Client project invoice",
  "Stock dividend",
  "Consulting fee",
  "Product sales revenue",
  "Freelance design work",
  "Investment returns",
  "Contract payment",
  "Commission earned",
  "Bonus payment",
];

const EXPENSE_DESCRIPTIONS = [
  "Office rent payment",
  "Electricity bill",
  "Employee salary",
  "Office supplies purchase",
  "Google Ads campaign",
  "Business travel",
  "SaaS subscription",
  "Internet bill",
  "Equipment purchase",
  "Team lunch",
];

function randomBetween(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomDate(monthsBack = 12) {
  const now = new Date();
  const past = new Date();
  past.setMonth(past.getMonth() - monthsBack);
  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime())
  );
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    await client.connect();
    const db = client.db("miniledger");
    console.log("Connected to MongoDB");

    // Create 5 seed users
    await db.collection("users").deleteMany({ seeded: true });

    const users = [
      {
        name: "Ravi Sharma",
        email: "ravi@miniledger.com",
        password: "hashed_pass_1",
        seeded: true,
        createdAt: new Date(),
      },
      {
        name: "Emily Chen",
        email: "emily@miniledger.com",
        password: "hashed_pass_2",
        seeded: true,
        createdAt: new Date(),
      },
      {
        name: "Daniel Fernandez",
        email: "daniel@miniledger.com",
        password: "hashed_pass_3",
        seeded: true,
        createdAt: new Date(),
      },
      {
        name: "Priya Patel",
        email: "priya@miniledger.com",
        password: "hashed_pass_4",
        seeded: true,
        createdAt: new Date(),
      },
      {
        name: "James Wilson",
        email: "james@miniledger.com",
        password: "hashed_pass_5",
        seeded: true,
        createdAt: new Date(),
      },
    ];

    const userResult = await db.collection("users").insertMany(users);
    const userIds = Object.values(userResult.insertedIds).map((id) =>
      id.toString()
    );
    console.log(`Inserted ${userIds.length} seed users`);

    // Clear old seeded records
    await db.collection("income").deleteMany({ seeded: true });
    await db.collection("expenses").deleteMany({ seeded: true });

    // Generate 600 income records
    const incomeRecords = [];
    for (let i = 0; i < 600; i++) {
      incomeRecords.push({
        userId: randomFrom(userIds),
        amount: randomBetween(500, 25000),
        category: randomFrom(INCOME_CATEGORIES),
        description: randomFrom(INCOME_DESCRIPTIONS),
        date: randomDate(12),
        seeded: true,
        createdAt: new Date(),
      });
    }

    await db.collection("income").insertMany(incomeRecords);
    console.log("Inserted 600 income records");

    // Generate 500 expense records
    const expenseRecords = [];
    for (let i = 0; i < 500; i++) {
      expenseRecords.push({
        userId: randomFrom(userIds),
        amount: randomBetween(100, 15000),
        category: randomFrom(EXPENSE_CATEGORIES),
        description: randomFrom(EXPENSE_DESCRIPTIONS),
        date: randomDate(12),
        seeded: true,
        createdAt: new Date(),
      });
    }

    await db.collection("expenses").insertMany(expenseRecords);
    console.log("Inserted 500 expense records");

    console.log("Seed complete: 1,100+ records inserted");
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await client.close();
  }
}

seed();
