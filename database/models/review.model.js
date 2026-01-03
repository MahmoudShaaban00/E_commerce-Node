
import mongoose from "mongoose";
const { Types } = mongoose;

const schema = new mongoose.Schema({
  comment:String,
  user:{
    type:Types.ObjectId,
    ref:'User',
    required:true,
  },
  rate:{
    type:Number,
    required:true,
    min:0,
    max:5,
  },
  product:{
    type:Types.ObjectId,
    ref:'Product',
    required:true,
  },
  
}, { timestamps: true ,versionKey:false});

export const Review = mongoose.model("Review", schema);