import express from "express";
import morgan from "morgan";
import logger from "./utils/logger.js"

import { connectDB } from "./utils/features.js";
import { errorMidleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";

//Importing Routes
import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/order.js';
import paymentRoutes from './routes/payment.js'

config({
    path:"./.env"
});

const port = process.env.PORT || 4000;

connectDB(process.env.DB_URI || "");

export const myCache = new NodeCache();

const app = express();

const morganFormat = ":method :url :status :response-time ms";
app.use(
    morgan(morganFormat, {
      stream: {
        write: (message: string) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );

app.use(express.json()); // Automatically parsed JSON

app.get("/",(req,res)=>{
    res.send("API working with /api/v1");
})

//Using Routes
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/product',productRoutes);
app.use('/api/v1/order',orderRoutes);
app.use('/api/v1/payment',paymentRoutes);

app.use("/uploads",express.static("uploads"));
app.use(errorMidleware);

app.listen(port,()=>{
    console.log(`Server is working on http://localhost:${port}`);
})