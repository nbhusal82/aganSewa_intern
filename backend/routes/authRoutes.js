import express from "express";
import {
  addbranchmanager,
  deletemanager,
  getmanagers,
  login,
  signout,
  updateManager,
} from "../controller/auth.js";
import { islogin } from "../middlewares/islogin.js";
import { isadmin } from "../middlewares/isAdmin.js";
const router = express.Router();
router.post("/login", login);
router.post("/logout", signout);
router.post("/addmanager", islogin, isadmin, addbranchmanager);
router.get("/getmanager", islogin, isadmin,getmanagers);
router.delete("/deletemanager/:id", islogin,isadmin, deletemanager);
router.patch("/updatemanager/:id", islogin,isadmin ,updateManager);

export default router;
