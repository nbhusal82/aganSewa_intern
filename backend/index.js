import express, { Router } from "express";
import dotenv from "dotenv";
import db from "./config/dbconn.js";
import router from "./routes/authRoutes.js";
import branch_router from "./routes/branch.routes.js";
import { sendError } from "./middlewares/errorhandler.js";
import service_Router from "./routes/service.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/users", router);
app.use("/api/branch", branch_router);
app.use("/api/service", service_Router);
app.use(sendError);
try {
  await db.connect();
  console.log("MySQL Connection");
} catch (error) {
  console.log("MySQL Connection Error:", error);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
