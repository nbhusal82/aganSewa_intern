import express from "express";
import { login, signout } from "../controller/auth.js";
const router = express.Router();
router.post("/login", login);
router.post("/signout", signout);

export default router;
