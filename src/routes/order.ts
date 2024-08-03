import express from "express";
import { allOrders, deleteOrder, getSingleOrder, myOrders, newOrder, processOrder } from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express();

//To Create New Order -/api/v1/order/new
app.post("/new",newOrder);

//To get my orders -/api/v1/order/new
app.get("/my",myOrders);

//To get all orders -/api/v1/order/new
app.get("/all",adminOnly,allOrders);

app.route("/:id").get(getSingleOrder).delete(adminOnly,deleteOrder);

app.get("/process-order/:id",adminOnly,processOrder);

export default app;