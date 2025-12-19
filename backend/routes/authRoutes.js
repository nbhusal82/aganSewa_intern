import express from "express";
import { addbranchmanager, login, signout } from "../controller/auth.js";
import { islogin } from "../middlewares/islogin.js";
const router = express.Router();
router.post("/login", login);
router.post("/logout", signout);
router.post("/addmanager", islogin, addbranchmanager);

export default router;
