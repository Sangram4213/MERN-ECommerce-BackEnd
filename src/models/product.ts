import mongoose from "mongoose";
  
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Name"],
    },
    photo: {
        type: String,
        required: [true, "Please Upload Photo"],
      },
      price: {
        type: Number,
        required: [true, "Please Enter Price"],
      },
      stock: {
        type: Number,
        required: [true, "Please Enter Stock"],
      },
      category: {
        type: String,
        trim:true,
        required: [true, "Please Enter Product Category"],
      },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", schema);
