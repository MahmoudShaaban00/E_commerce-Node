import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cartItems: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, default: 1, min: 1 },
            price: { type: Number, },
        }
    ],
    totalCartPrice: Number,
    discount: Number,
    totalPriceAfterDiscount: Number,
}, { timestamps: true, versionKey: false });

export const Cart = model("Cart", cartSchema);