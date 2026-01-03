import { catchError } from "../../middleware/catchError.js";
import { Cart } from "../../../database/models/cart.model.js";
import { Order } from "../../../database/models/order.model.js";
import { Product } from "../../../database/models/product.model.js";
import { AppError } from "../../utils/appError.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.SECRET_KEY);


const createCashOrder = catchError(async (req, res, next) => {

    // 1️⃣ get cart
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
        return next(new AppError("Cart not found", 404));
    }

    // 2️⃣ calculate price
    const totalOrderPrice =
        cart.totalPriceAfterDiscount || cart.totalCartPrice;

    // 3️⃣ create order
    const order = new Order({
        user: req.user._id,
        orderItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice,
        paymentType: "CASH",
    });

    await order.save();

    // 4️⃣ update product stock & sold
    const bulkOptions = cart.cartItems.map(item => ({
        updateOne: {
            filter: { _id: item.product },
            update: {
                $inc: {
                    stock: -item.quantity,
                    sold: item.quantity,
                }
            }
        }
    }));

    await Product.bulkWrite(bulkOptions);

    // 5️⃣ delete cart
    await Cart.findByIdAndDelete(cart._id);

    res.status(201).json({
        status: "success",
        data: order
    });
});

const getAllOrders = catchError(async (req, res, next) => {
    const orders = await Order.find();
    res.status(200).json({ status: "success", results: orders.length, data: orders });
});

const getUserOrders = catchError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id }).populate('orderItems.product');
    res.status(200).json({ status: "success", results: orders.length, data: orders });
});

const createCheckoutSession = catchError(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) return next(new AppError("Cart not found", 404));

  const session = await stripe.checkout.sessions.create({
    line_items: cart.cartItems.map(item => ({
      price_data: {
        currency: "egp",
        product_data: {
          name: `Order for ${req.user.name}`, // ✅ اسم المستخدم
        },
        unit_amount: Math.round(item.price * 100), // سعر القطعة
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/orders/checkout-success?cartId=${cart._id}&userId=${req.user._id}`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.id,
  });

  res.status(200).json({ status: "success", session });
});


export { createCashOrder, getAllOrders, getUserOrders, createCheckoutSession };