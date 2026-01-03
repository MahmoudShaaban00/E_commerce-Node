import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: [2, "Too short category name"],
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  image: String,
}, { timestamps: true, versionKey: false });

schema.post("init", function (doc) {
  if (doc.image) {
    doc.image = process.env.BASE_URL + "categories/" + doc.image;
  }
});

export const Category = mongoose.model("Category", schema);
