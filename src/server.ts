import "dotenv/config";
import express from "express";
const app = express();
import morgan from "morgan";
import helmet from "helmet";
import notFound from "./middleware/notFound";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware";
import connectDB from "./db/connectDB";
import authRouter from "./routes/authRouter";
import cookieParser from "cookie-parser";

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(helmet());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v1/auth", authRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}...`);
    });
  } catch (error) {
    console.log("Failed to start server", error);
  }
};

start();
