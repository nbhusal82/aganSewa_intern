import express from "express";
import {
  createStaff,
  deleteStaff,
  getStaffs,
  updateStaff,
} from "../controller/staff.controller.js";

const staff_router = express.Router();

staff_router.post("/", createStaff);
staff_router.get("/", getStaffs);
staff_router.delete("/:id", deleteStaff);
staff_router.patch("/:id", updateStaff);
export default staff_router;
