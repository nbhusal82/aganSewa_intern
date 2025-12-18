import express from "express";
import {
  createStaff,
  deleteStaff,
  getStaffs,
  updateStaff,
} from "../controller/staff.controller.js";
import { uploadstaff } from "../utlis/multer.js";

const staff_router = express.Router();

staff_router.post("/",uploadstaff.single("image"), createStaff);
staff_router.get("/", getStaffs);
staff_router.delete("/:id", deleteStaff);
staff_router.patch("/:id",uploadstaff.single("image"), updateStaff);
export default staff_router;
