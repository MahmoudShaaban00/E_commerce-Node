import express from "express";
import { bootstrap } from "./src/modules/bootstrap.js";
import { AppError } from "./src/utils/appError.js";
import { globalError } from "./src/middleware/globalError.js";
import cors from "cors";

import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;



// 2️⃣ Middleware
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());

// 3️⃣ Bootstrap routes
bootstrap(app);

// 4️⃣ Handle unhandled routes
app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

// 5️⃣ Global error handler
app.use(globalError);

// 6️⃣ Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
