import express from "express";
import { allOrders, myOrders, newOrder } from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express();

//To Create New Order -/api/v1/order/new
app.post("/new",newOrder);

//To get my orders -/api/v1/order/new
app.get("/my-order",myOrders);

//To get all orders -/api/v1/order/new
app.get("/all",adminOnly,allOrders);


export default app;