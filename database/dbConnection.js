import { connect } from "mongoose";

export const dbConn = connect("mongodb+srv://mahmoud:jfxT3fQfA85HrPZI@cluster0.yhtcrzf.mongodb.net/e-commerce")
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
