import express from "express";
import { bootstrap } from "./src/app.controller.js";
import dotenv from 'dotenv'
dotenv.config()
const app = express();
const port = process.env.PORT || 3000;

bootstrap(express, app);

app.listen(port, () => {
  console.log("the server is runing on port 3000");
});
