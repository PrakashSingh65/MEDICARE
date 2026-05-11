import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import fileUpload from "express-fileupload";
import userRouter from "./router/user.routes.js";
import { ConnectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 },
  abortOnLimit: true,
}));

app.use(userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Medicare API!");
});

ConnectDB();

app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});