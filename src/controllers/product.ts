import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQuery,
  NewProductRequestBody,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";

// import {faker} from '@faker-js/faker';

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
  const products = await Product.find({})
    .sort({
      createdAt: -1,
    })
    .limit(5);

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getAllCategories = TryCatch(async (req, res, next) => {
  const categories = await Product.distinct("category");
  return res.status(200).json({
    success: true,
    categories,
  });
});

export const getAdminProducts = TryCatch(async (req, res, next) => {
  const products = await Product.find({});

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getSingleProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product is not exist", 404));

  return res.status(200).json({
    success: true,
    product,
  });
});

export const deleteSingleProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product is not exist", 404));

  rm(product.photo!, () => {
    console.log("Product photo deleted");
  });
  await Product.findByIdAndDelete(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, category, stock, price } = req.body;
  const photo = req.file;
  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("Product is not exist", 404));

  if (photo) {
    rm(product.photo!, () => {
      console.log("Old Photo Deleted");
    });
    product.photo = photo.path;
  }
  if (name) product.name = name;
  if (category) product.category = category;
  if (stock) product.stock = stock;
  if (price) product.price = price;

  await product.save();

  return res.status(200).json({
    success: true,
    message: "product Updated successfully!",
  });
});

export const getSearchProduct = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;

    const skip = limit * (page - 1);

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category;

    const productPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredProduct] = await Promise.all([
      productPromise,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredProduct.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
);

// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\fedb48c6-c555-43fd-a49c-c094b23f0bfb.jpeg",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };

//     products.push(product);
//   }

//   await Product.create(products);

//   console.log({ succecss: true });
// };

// const deleteRandomsProducts = async(count:number=10)=>{
//   const products = await Product.find({}).skip(4);
//   for(let i=0;i<products.length;i++){
//     const product = products[i];
//     await product.deleteOne();
//   }
//   console.log({success:true});
// }
