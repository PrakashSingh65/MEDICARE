import express from "express";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./router/user.routes.js";
import adminRouter from "./router/admin.routes.js";
import doctorRouter from "./router/doctor.routes.js";
import patientRouter from "./router/patient.routes.js";
import { ConnectDB } from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed =
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin === process.env.CLIENT_URL;
      if (isAllowed) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/doctor", doctorRouter);
app.use("/api/v1/patient", patientRouter);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Medicare API!", status: "healthy" });
});

ConnectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});