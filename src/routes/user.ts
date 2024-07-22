import express from "express";
import { newUser } from "../controllers/user.js";

const app = express();

app.post('/new',newUser);

export default app;