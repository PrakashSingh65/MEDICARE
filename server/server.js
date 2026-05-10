import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";


const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Welcome to the Medicare API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});