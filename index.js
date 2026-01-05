import express from "express";
import cors from "cors";
import { bootstrap } from "./src/modules/bootstrap.js";
import { AppError } from "./src/utils/appError.js";
import { globalError } from "./src/middleware/globalError.js";
import { dbConn } from "./database/dbConnection.js";

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* Routes */
bootstrap(app);

/* 404 */
app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

/* Error handler */
app.use(globalError);

/* ================= LOCAL LISTEN ================= */
const PORT = process.env.PORT || 3000;

// لو شغال local
if (process.env.NODE_ENV !== "production") {
  dbConn().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  });
}

/* ================= SERVERLESS EXPORT ================= */
export default async function handler(req, res) {
  try {
    await dbConn();
    app(req, res);
  } catch (err) {
    console.error("Serverless Function error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
