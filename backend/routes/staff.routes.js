import express from "express";
import {
  createStaff,
  deleteStaff,
  getStaffs,
  loginStaff,
  logoutStaff,
  updateStaff,
} from "../controller/staff.controller.js";
import { uploadstaff } from "../utlis/multer.js";
import { islogin } from "../middlewares/islogin.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const staff_router = express.Router();

staff_router.post(
  "/",
  islogin,
  authorizeRoles("manager"),
  uploadstaff.single("image"),
  createStaff
);
staff_router.get("/", islogin, authorizeRoles("manager"), getStaffs);
staff_router.delete("/:id", islogin, authorizeRoles("manager"), deleteStaff);
staff_router.patch(
  "/:id",
  islogin,
  authorizeRoles("manager"),
  uploadstaff.single("image"),
  updateStaff
);
staff_router.post("/login", loginStaff);

staff_router.post("/logout", logoutStaff);
export default staff_router;
