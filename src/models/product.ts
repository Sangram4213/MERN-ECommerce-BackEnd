import mongoose from "mongoose";
  
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Name"],
    },
    photo: {
        public_id:{
          type:String,
          required:true
        },
        url:{
          type:String,
          required:true
        }
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
