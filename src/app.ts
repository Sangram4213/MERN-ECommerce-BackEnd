import express from "express";

const port = 5000;

const app = express();

app.listen(port,()=>{
    console.log(`Server is workin on http://localhost:${port}`);
})