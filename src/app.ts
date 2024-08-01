import express from "express";

import { connectDB } from "./utils/features.js";
import { errorMidleware } from "./middlewares/error.js";
import NodeCache from "node-cache";

//Importing Routes
import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/order.js';


const port = 4000;

connectDB();

export const myCache = new NodeCache();

const app = express();

app.use(express.json()); // Automatically parsed JSON

app.get("/",(req,res)=>{
    res.send("API working with /api/v1");
})

//Using Routes
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/product',productRoutes);
app.use('/api/v1/order',orderRoutes);

app.use("/uploads",express.static("uploads"));
app.use(errorMidleware);

app.listen(port,()=>{
    console.log(`Server is working on http://localhost:${port}`);
})