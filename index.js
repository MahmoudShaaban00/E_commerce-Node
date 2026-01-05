import express from "express";
import cors from "cors";
import { bootstrap } from "./src/modules/bootstrap.js";
import { AppError } from "./src/utils/appError.js";
import { globalError } from "./src/middleware/globalError.js";
import { dbConn } from "./database/dbConnection.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

bootstrap(app);

app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

app.use(globalError);

export default async function handler(req, res) {
  try {
    await dbConn();
    return app(req, res);
  } catch (err) {
    console.error("Serverless error:", err);
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
}
