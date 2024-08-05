import express from 'express';
import { applyDiscount, deleteCoupon, getAllCoupon, newCoupon } from '../controllers/payment.js';


const app = express();

//route- /api/v1/payment/coupon/new
app.post('/coupon/new',newCoupon);

//route- /api/v1/payment/discount
app.get('/discount',applyDiscount);

//route- /api/v1/payment/coupon/all
app.get('/coupon/all',getAllCoupon);

//route- /api/v1/payment/coupon/:id
app.delete('/coupon/:id',deleteCoupon);


export default app;