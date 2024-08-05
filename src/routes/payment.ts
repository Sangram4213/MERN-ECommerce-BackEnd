import express from 'express';
import { applyDiscount, newCoupon } from '../controllers/payment.js';


const app = express();

//route- /api/v1/payment/coupon/new
app.post('/coupon/new',newCoupon);

//route- /api/v1/payment/discount
app.get('/discount',applyDiscount);

export default app;