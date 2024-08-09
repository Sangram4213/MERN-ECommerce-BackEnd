import express from 'express';
import { applyDiscount, createPaymentIntent, deleteCoupon, getAllCoupon, newCoupon } from '../controllers/payment.js';
import { adminOnly } from '../middlewares/auth.js';
import { createPath } from 'react-router-dom';


const app = express();

//route- /api/v1/payment/create
app.get('/create',createPaymentIntent);

//route- /api/v1/payment/coupon/new
app.post('/coupon/new',adminOnly,newCoupon);

//route- /api/v1/payment/discount
app.get('/discount',adminOnly,applyDiscount);

//route- /api/v1/payment/coupon/all
app.get('/coupon/all',adminOnly,getAllCoupon);

//route- /api/v1/payment/coupon/:id
app.delete('/coupon/:id',adminOnly,deleteCoupon);


export default app;