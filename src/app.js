import express, { json } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()

import router from "./routes/index.js";

const app = express()
app.use(cors());
app.use(json());

app.use(router);

app.listen('4000', () => {
    console.log(`rodando na porta 4000`);
});