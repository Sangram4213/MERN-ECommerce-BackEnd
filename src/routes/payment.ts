import express from 'express';
import { newCoupon } from '../controllers/payment.js';


const app = express();

//route- /api/v1/payment/coupon/new
app.get('/coupon/new',newCoupon);

export default app;