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
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();
router.post("/login", login);
router.post("/logout", signout);
router.post("/addmanager", islogin, authorizeRoles("admin"), addbranchmanager);
router.get("/getmanager", islogin, authorizeRoles("admin"), getmanagers);
router.delete(
  "/deletemanager/:id",
  islogin,
  authorizeRoles("admin"),
  deletemanager
);
router.patch(
  "/updatemanager/:id",
  islogin,
  authorizeRoles("admin"),
  updateManager
);

export default router;
