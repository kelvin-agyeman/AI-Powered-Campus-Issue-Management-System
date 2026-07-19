import "dotenv/config";
import express from "express";
const app = express();
import morgan from "morgan";
import helmet from "helmet";
import notFound from "./middleware/notFound";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware";
import connectDB from "./db/connectDB";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import issueRouter from "./routes/issueRouter";
import notificationRouter from "./routes/notificationRouter";
import adminRouter from "./routes/adminRouter";
import staffRouter from "./routes/staffRouter";
import superAdminRouter from "./routes/superAdminRouter";
import analyticsRouter from "./routes/analyticsRouter";
import cookieParser from "cookie-parser";
import {
  authenticateUser,
  authorizePermissions,
} from "./middleware/authMiddleware";
import cloudinary from "cloudinary";
import YAML from "yamljs";
import swaggerUI from "swagger-ui-express";

const swaggerDocument = YAML.load("./src/docs/swagger.yaml");

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(helmet());
app.use(cookieParser(process.env.JWT_SECRET));
app.set("trust proxy", 1);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", authenticateUser, userRouter);
app.use(
  "/api/v1/issue",
  authenticateUser,
  authorizePermissions("student"),
  issueRouter,
);
app.use("/api/v1/notifications", authenticateUser, notificationRouter);
app.use(
  "/api/v1/admin",
  authenticateUser,
  authorizePermissions("admin"),
  adminRouter,
);
app.use(
  "/api/v1/staff",
  authenticateUser,
  authorizePermissions("staff"),
  staffRouter,
);
app.use(
  "/api/v1/super-admin",
  authenticateUser,
  authorizePermissions("super_admin"),
  superAdminRouter,
);
app.use(
  "/api/v1/analytics",
  authenticateUser,
  authorizePermissions("admin", "super_admin"),
  analyticsRouter,
);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

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
