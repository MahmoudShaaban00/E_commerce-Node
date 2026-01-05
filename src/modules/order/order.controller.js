import { catchError } from "../../middleware/catchError.js";
import { Cart } from "../../../database/models/cart.model.js";
import { Order } from "../../../database/models/order.model.js";
import { Product } from "../../../database/models/product.model.js";
import { AppError } from "../../utils/appError.js";
import stripe from "../../utils/stripe.js";

/* ================= CASH ORDER ================= */
export const createCashOrder = catchError(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) return next(new AppError("Cart not found", 404));

  const totalOrderPrice =
    cart.totalPriceAfterDiscount || cart.totalCartPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
    paymentType: "CASH",
  });

  const bulkOps = cart.cartItems.map(item => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { stock: -item.quantity, sold: item.quantity } },
    },
  }));

  await Product.bulkWrite(bulkOps);
  await Cart.findByIdAndDelete(cart._id);

  res.status(201).json({ status: "success", data: order });
});

/* ================= GET ORDERS ================= */
export const getAllOrders = catchError(async (req, res) => {
  const orders = await Order.find();
  res.json({ status: "success", results: orders.length, data: orders });
});

export const getUserOrders = catchError(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("orderItems.product");
  res.json({ status: "success", results: orders.length, data: orders });
});

/* ================= STRIPE CHECKOUT ================= */
export const createCheckoutSession = catchError(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) return next(new AppError("Cart not found", 404));

  if (!stripe) {
  return next(new AppError("Stripe is not configured", 500));
}

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: cart.cartItems.map(item => ({
      price_data: {
        currency: "egp",
        product_data: { name: item.product.title || "Product" },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    customer_email: req.user.email,
    success_url: `${req.protocol}://${req.get("host")}/api/orders/success`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/cart`,
    client_reference_id: cart._id.toString(),
  });

  res.status(200).json({ status: "success", session });
});

