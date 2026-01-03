
import mongoose, { Types } from "mongoose";

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
  category:{
    type:Types.ObjectId,
    ref:"Category",
  },
    image:String
}, { timestamps: true ,versionKey:false});

schema.post("init", function (doc) {
  if (doc.image) {
    doc.image = process.env.BASE_URL + "subCategories/" + doc.image;
  }
});

export const SubCategory = mongoose.model("SubCategory", schema);
