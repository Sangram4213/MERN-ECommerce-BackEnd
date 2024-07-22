import express from "express";





//Importing Routes
import userRoutes from './routes/user.js';
import { connectDB } from "./utils/features.js";

const port = 4000;

connectDB();

const app = express();

app.get("/",(req,res)=>{
    res.send("API working with /api/v1");
})

//Using Routes
app.use('/api/v1/user',userRoutes);

app.listen(port,()=>{
    console.log(`Server is working on http://localhost:${port}`);
})