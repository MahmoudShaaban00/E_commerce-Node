import express from "express";
import { bootstrap } from "./src/modules/bootstrap.js";
import { AppError } from "./src/utils/appError.js";
import { globalError } from "./src/middleware/globalError.js";
import cors from "cors";
import { dbConn } from "./database/dbConnection.js";
import "dotenv/config";

const app = express();

// Middleware
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json());

// Routes
bootstrap(app);

// Handle unhandled routes
app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalError);

// Serverless export
export default async function handler(req, res) {
  try {
    await dbConn(); // اتصال قاعدة البيانات
    app(req, res);
  } catch (err) {
    console.error("Serverless Function error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

