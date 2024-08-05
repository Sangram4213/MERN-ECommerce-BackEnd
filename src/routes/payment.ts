import express from 'express';
import { applyDiscount, deleteCoupon, getAllCoupon, newCoupon } from '../controllers/payment.js';
import { adminOnly } from '../middlewares/auth.js';


const app = express();

//route- /api/v1/payment/coupon/new
app.post('/coupon/new',adminOnly,newCoupon);

//route- /api/v1/payment/discount
app.get('/discount',adminOnly,applyDiscount);

//route- /api/v1/payment/coupon/all
app.get('/coupon/all',adminOnly,getAllCoupon);

//route- /api/v1/payment/coupon/:id
app.delete('/coupon/:id',adminOnly,deleteCoupon);


export default app;