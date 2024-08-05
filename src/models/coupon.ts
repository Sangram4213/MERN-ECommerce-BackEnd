import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    
    coupon:{
       type:String,
       required:[true,"Please Enter the Coupon Code"],
       unique:true
    },
    amount:{
        type:String,
        required:[true,"Please Enter the Discount Amount"],
    }
})

export const Coupon = mongoose.model("Coupon",schema);