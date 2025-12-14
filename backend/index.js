import express, { Router } from "express";
import dotenv from "dotenv";
import db from "./config/dbconn.js";
import router from "./routes/authRoutes.js";
import { errorhandeler } from "./middlewares/errorhandler.js";
import branch_router from "./routes/branch.routes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(errorhandeler);
app.use(express.json());
app.use("/api/users", router);
app.use("/api/branch", branch_router);
try {
  await db.connect();
  console.log("MySQL Connection");
} catch (error) {
  console.log("MySQL Connection Error:", error);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
