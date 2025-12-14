import express from "express";
import {
  add_district,
  addprovince,
  delete_district,
  deleteprovince,
  get_district,
  getprovince,
} from "../controller/branch.js";

const branch_router = express.Router();

branch_router.post("/", addprovince);
branch_router.get("/", getprovince);
branch_router.delete("/:id", deleteprovince);

//district

branch_router.post("/add-dis", add_district);
branch_router.get("/get-dis", get_district);
branch_router.delete("/delete-dis/:id", delete_district);

export default branch_router;
