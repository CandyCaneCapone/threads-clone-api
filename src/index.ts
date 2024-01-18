import express, { Express } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import notFound from "./middlewares/not-found";
import errorHandler from "./middlewares/error-handler";
import connectDB from "./database/connect";
import router from "./routes";

dotenv.config();

const app: Express = express();

          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

app.use(express.json({limit : "50mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/api/v1", router);

app.use(notFound);
app.use(errorHandler);

connectDB();

const port: number | string = process.env.PORT || 3000;
app.listen(port, () => console.log(`http://localhost:${port}`));
