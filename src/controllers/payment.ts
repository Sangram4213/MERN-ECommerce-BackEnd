import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import { generateOrderId } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { Cashfree } from "cashfree-pg";

export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { name, id, amount, email } = req.params;
  let request: any = {
    order_amount: amount,
    order_currency: "INR",
    order_id: generateOrderId(),
    customer_details: {
      customer_id: "node_sdk_test",
      customer_name: name,
      customer_email: email,
      customer_phone: "9999999999",
    },
  };

  const response = await Cashfree.PGCreateOrder("2023-08-01", request);

  if (!response) {
    return next(new ErrorHandler("Error during payment", 404));
  }

  console.log(response.data.order_id);

  res.status(200).json({
    success: true,
    response:{
      paymentSessionId: response.data?.payment_session_id,
      orderId:response.data.order_id
    }
  });
});

export const verifyPayment = TryCatch(async (req, res, next) => {
  try {
    let { orderId } = req.body;

    Cashfree.PGOrderFetchPayments("2023-08-01", orderId)
      .then((response) => {
        res.json(response.status);
      })
      .catch((error) => {
        console.error(error.response.data.message);
      });
  } catch (error) {
    console.log(error);
  }
});

export const newCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;

  if (!coupon || !amount)
    return next(new ErrorHandler("Please Enter Both Coupon and Amount", 400));
  await Coupon.create({
    code: coupon,
    amount,
  });

  res.status(201).json({
    success: true,
    messagee: `Coupon ${coupon} Created Successfully`,
  });
});

export const applyDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;
  const discount = await Coupon.findOne({ code: coupon });

  if (!discount) return next(new ErrorHandler("Invalid Coupon Code", 404));
  res.status(200).json({
    success: true,
    discount: discount.amount,
  });
});

export const getAllCoupon = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find({});

  if (!coupons) return next(new ErrorHandler("Coupons not exist", 404));
  res.status(200).json({
    success: true,
    coupons,
  });
});

export const deleteCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findByIdAndDelete(id);

  if (!coupon) return next(new ErrorHandler("Coupons not exist", 404));

  res.status(200).json({
    success: true,
    message: `Coupon ${coupon.code} Deleted`,
  });
});
