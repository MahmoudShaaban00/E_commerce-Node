import { connect } from "mongoose";

export const dbConn = connect("mongodb+srv://mahmoud:bqZBwdXEPPhCN5ve@cluster0.yhtcrzf.mongodb.net/e-commerce")
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
