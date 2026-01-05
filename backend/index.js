import express, { Router } from "express";
import dotenv from "dotenv";
import db from "./config/dbconn.js";
import router from "./routes/authRoutes.js";
import branch_router from "./routes/branch.routes.js";
import profile_router from "./routes/profile.js";
import { sendError } from "./middlewares/errorhandler.js";
import service_Router from "./routes/service.routes.js";
import site_router from "./routes/site.routes.js";
import staff_router from "./routes/staff.routes.js";
import cookie_parser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT;
app.use(cookie_parser());
app.use("/uploads", express.static("uploads"));

app.use("/api/users", router);
app.use("/api/branch", branch_router);
app.use("/api/profile", profile_router);
app.use("/api/service", service_Router);
app.use("/api/site", site_router);
app.use("/api/staff", staff_router);

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
