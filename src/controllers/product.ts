import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewProductRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";

export const newProduct = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    const { name, category, stock, price } = req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please Add Photo", 400));

    if (!name || !category || !stock || !price) {
      rm(photo.path, () => {
        console.log("Deleted!");
      });
      return next(new ErrorHandler("Pkease Add Enter All Feild", 400));
    }
    await Product.create({
      name,
      category: category.toLowerCase(),
      stock,
      price,
      photo: photo.path,
    });
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  }
);

export const getlatestProducts = TryCatch(async (req, res, next) => {
  const products = await Product.find({}).sort({
    createdAt: -1,
  }).limit(5);

  return res.status(200).json({
    success:true,
    products
  })
});
