
import mongoose, { Types } from "mongoose";
import bycrpt from "bcrypt";

const schema = new mongoose.Schema({
  name:String,
    email:String,
    password:String,
  isBlocked:{
    type:Boolean,
    default:false,
  },
  role:{
    type:String,
    enum:['user','admin',],
    default:'user',
  },
  createdBy:{
    type:Types.ObjectId,
    ref:'User',
  },
  changePasswordAt:Date,
  wishList:[{
    type:Types.ObjectId,
    ref:'Product',
  }],
  addresses:[{
    city:String,
    phone:String,
    street:String,
  }]
}, { timestamps: true ,versionKey:false});

schema.pre('save', function () {
  this.password = bycrpt.hashSync(this.password, 8);
})

schema.pre('findOneAndUpdate', function () {
  if (this._update.password) {
    this._update.password = bycrpt.hashSync(this._update.password, 8);
  }
})

export const User = mongoose.model("User", schema);