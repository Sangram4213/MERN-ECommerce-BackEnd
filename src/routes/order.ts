import express from "express";
import { newOrder } from "../controllers/order.js";

const app = express();

//To Create New Product -/api/v1/order/new
app.get("/new",newOrder);


export default app;