import { TryCatch } from "../middlewares/error.js";

export const newOrder = TryCatch(async(req,res,next)=>{
   return res.status(200).json({
    success:true,
    message:"Route working proper"
   })
})