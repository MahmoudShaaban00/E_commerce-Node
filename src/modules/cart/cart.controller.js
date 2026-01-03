import { catchError } from '../../middleware/catchError.js';
import { Cart } from '../../../database/models/cart.model.js';
import { Product } from '../../../database/models/product.model.js'
import { Coupon } from '../../../database/models/coupon.model.js';


function calcTotalPrice(cart) {
  cart.totalCartPrice = cart.cartItems.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  if(cart.discount){
    cart.totalPriceAfterDiscount = cart.totalCartPrice - (cart.totalCartPrice * cart.discount) / 100;
  }
}

const addToCart = catchError(async (req, res, next) => {

  let cart = await Cart.findOne({ user: req.user._id });

  let product = await Product.findById(req.body.product);
  if (!product) return next(new Error('product not found', { cause: 404 }));

  req.body.price = product.price;

  if (req.body.quantity > product.stock)
    return next(new Error('quantity exceeds available stock', { cause: 404 }));

  // 🛒 لو مفيش كارت
  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      cartItems: [req.body] // ✅ الاسم الصح
    });

    calcTotalPrice(cart);
    await cart.save();

    return res.json({ message: 'cart added successfully', cart });
  }

  // 🛒 لو الكارت موجود
  let item = cart.cartItems.find(
    item => item.product.toString() === req.body.product
  );

  if (item) {
    item.quantity += req.body.quantity || 1;

    if (item.quantity > product.stock)
      return next(new Error('quantity exceeds available stock', { cause: 404 }));
  } else {
    cart.cartItems.push(req.body);
  }

  calcTotalPrice(cart);
  await cart.save();

  return res.json({ message: 'success', cart });
});

const updateCart = catchError(async (req, res, next) => {

    let item = await Cart.findOne({ user: req.user._id });
    if (!item) return next(new Error('cart not found', { cause: 404 }));
    let product = item.cartItems.find(item => item.product == req.params.id);
    if (!product) return next(new Error('product not found in cart', { cause: 404 }));
    product.quantity = req.body.quantity || product.quantity;
    calcTotalPrice(item);
    await item.save();
    return res.json({ message: 'cart updated successfully', item });
});

const deleteFromCart = catchError(async (req, res, next) => {

  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.id } } },
    { new: true }
  );

  if (!cart) return next(new Error('cart not found', { cause: 404 }));

  calcTotalPrice(cart);
  await cart.save();

  res.json({ message: 'cart item deleted successfully', cart });
});

const getloggedUserCart = catchError(async (req, res, next) => {

    let cart = await Cart.findOne({ user: req.user._id });
    cart || next(new Error('cart not found', { cause: 404 }));
    !cart || res.json({ message: 'success', cart });
});

const clearCart = catchError(async (req, res, next) => {

    let cart = await Cart.findOneAndDelete({ user: req.user._id });
    cart || next(new Error('cart not found', { cause: 404 }));
    !cart || res.json({ message: 'cart cleared successfully' });
});

const applyCoupon = catchError(async (req, res, next) => {
    let coupon = await Coupon.findOne({ code: req.body.code , expires :{$gt : Date.now()} });
    if (!coupon) return next(new Error('invalid or expired coupon', { cause: 404 }));
    let cart = await Cart.findOne({user : req.user._id})
    cart.discount = coupon.discount;
    await cart.save();
    res.json({ message: 'coupon applied successfully', cart });
});



export { addToCart, updateCart  , deleteFromCart , getloggedUserCart, clearCart, applyCoupon };