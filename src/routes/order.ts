import express from "express";
import { myOrders, newOrder } from "../controllers/order.js";

const app = express();

//To Create New Order -/api/v1/order/new
app.post("/new",newOrder);

//To get all orders -/api/v1/order/new
app.get("/my-order",myOrders);


export default app;