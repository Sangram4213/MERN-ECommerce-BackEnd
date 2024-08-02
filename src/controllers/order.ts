import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";

export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;

      if(!shippingInfo || !orderItems || !user || !subtotal || !tax  || !total) return next(new ErrorHandler("Please Enter All Feild",400));
      await Order.create({
        shippingInfo,
        orderItems,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total,
      });

    await reduceStock(orderItems);
    await invalidateCache({ product: true, order: true, admin: true });

    return res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
    });
  }
);


export const myOrders = TryCatch(async(req,res,next)=>{
   const {id:user} = req.query;
   let orders;
   
   if(myCache.has(`my-orders-${user}`)) orders = JSON.parse(myCache.get(`my-orders-${user}`) as string);
   else {
      orders = await Order.find({user});
      myCache.set(`my-orders-${user}`,JSON.stringify(orders));
   }

   if(!orders) return next(new ErrorHandler("Order is not exist",404));

   res.status(200).json({
      success:true,
      orders,
   })
})