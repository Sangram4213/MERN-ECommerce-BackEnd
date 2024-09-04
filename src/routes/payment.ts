import express from 'express';
import { applyDiscount, createPaymentIntent, deleteCoupon, getAllCoupon, newCoupon, verifyPayment } from '../controllers/payment.js';
import { adminOnly } from '../middlewares/auth.js';
import { createPath } from 'react-router-dom';


const app = express();

//route- /api/v1/payment/create
app.get('/create/:name/:id/:amount/:email',createPaymentIntent);

//route- api/v1/payment/verify
app.post('/verify',verifyPayment);

//route- /api/v1/payment/coupon/new
app.post('/coupon/new',adminOnly,newCoupon);

//route- /api/v1/payment/discount
app.get('/discount',applyDiscount);

//route- /api/v1/payment/coupon/all
app.get('/coupon/all',adminOnly,getAllCoupon);

//route- /api/v1/payment/coupon/:id
app.delete('/coupon/:id',adminOnly,deleteCoupon);


export default app;