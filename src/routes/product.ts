import express from "express";
import { getlatestProducts, newProduct } from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express();

app.post("/new",adminOnly,singleUpload,newProduct);

app.get("/latest",getlatestProducts);




export default app;