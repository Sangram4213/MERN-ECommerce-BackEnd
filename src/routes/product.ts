import express from "express";
import { deleteSingleProduct, getAdminProducts, getAllCategories, getlatestProducts, getSearchProduct, getSingleProduct, newProduct, updateProduct } from "../controllers/product.js";
import { adminOnly } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const app = express();

//To Create New Product -/api/v1/product/new
app.post("/new",adminOnly,singleUpload,newProduct);

// To Get All Product with filters -/api/v1/product/search
app.get("/all",getSearchProduct);

// To get last 10 latest Product -/api/v1/product/latest
app.get("/latest",getlatestProducts);

//To get all unioque category -/api/v1/product/category
app.get("/category", getAllCategories);

//To get all unioque category -/api/v1/product/admin-products
app.get("/admin-products",getAdminProducts);

app.route("/:id").get(adminOnly,getSingleProduct).delete(adminOnly,deleteSingleProduct).put(adminOnly,singleUpload,updateProduct);


export default app;