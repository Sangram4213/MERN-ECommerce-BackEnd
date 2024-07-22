import express from "express";

//Importing Routes
import userRoutes from './routes/user.js';
import { connectDB } from "./utils/features.js";
import { errorMidleware } from "./middlewares/error.js";

const port = 4000;

connectDB();

const app = express();

app.use(express.json()); // Automatically parsed JSON

app.get("/",(req,res)=>{
    res.send("API working with /api/v1");
})

//Using Routes
app.use('/api/v1/user',userRoutes);

app.use(errorMidleware);

app.listen(port,()=>{
    console.log(`Server is working on http://localhost:${port}`);
})