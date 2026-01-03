import mongoose from "mongoose";

let cachedDb = null;

export const dbConn = async () => {
  if (cachedDb) return cachedDb;

  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error(
      "MONGO_URI is not defined. Check your .env file or Vercel Environment Variables."
    );
  }

  try {
    cachedDb = await mongoose.connect(uri, {
      dbName: "e-commerce" // فقط اسم قاعدة البيانات
      // لا تضع useNewUrlParser أو useUnifiedTopology مع Mongoose >=7
    });
    console.log("Database connected successfully");
    return cachedDb;
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};
