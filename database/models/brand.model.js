
import mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength:[2,'Too short category name'],
  },
  slug:{
    type:String,
    required:true,
    lowercase:true,
  },
    logo:{
      type:String,
      required:true,
      trim:true,
    }
}, { timestamps: true ,versionKey:false});

schema.post("init", function (doc) {
  if (doc.logo) {
    doc.logo = process.env.BASE_URL + "brands/" + doc.logo;
  }
});

export const Brand = mongoose.model("Brand", schema);