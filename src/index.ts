import express, { Express } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import notFound from "./middlewares/not-found";
import errorHandler from "./middlewares/error-handler";
import connectDB from "./database/connect";
import router from "./routes";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/api/v1", router);

app.use(notFound);
app.use(errorHandler);

connectDB();

const port: number | string = process.env.PORT || 3000;
app.listen(port, () => console.log(`http://localhost:${port}`));
