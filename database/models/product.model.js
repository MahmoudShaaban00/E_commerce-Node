
import mongoose, { Types } from "mongoose";



const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: [2, 'Too short category name'],
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  imageCover: String,
  images: [String],
  description: {
    type: String,
    required: true,
    minLength: [20, 'Too short category description'],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  priceAfterDiscount: {
    type: Number,
    min: 0,
  },
  sold: Number,
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: Types.ObjectId,
    ref: 'category',
  },
  subcategory: {
    type: Types.ObjectId,
    ref: 'category',
  },
  brand: {
    type: Types.ObjectId,
    ref: 'Brand',
  },
  rateAverage: {
    type: Number,
    min: 0,
    max: 5,
  },
  rateCount: Number,
}, { timestamps: true, versionKey: false , toJSON: { virtuals: true } });

schema.post("init", function (doc) {
  if(doc.imageCover)  doc.imageCover = process.env.BASE_URL + "products/" + doc.imageCover;
  if(doc.images)  doc.images = doc.images.map(img => process.env.BASE_URL + "products/" + img);
  
});

schema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

schema.pre("findOne",function(){
  this.populate("reviews");
})

export const Product = mongoose.model("Product", schema);