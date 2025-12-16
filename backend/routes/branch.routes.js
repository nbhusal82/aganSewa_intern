import express from "express";
import {
  add_district,
  addbranch,
  addprovince,
  delete_district,
  deletebranch,
  deleteprovince,
  get_district,
  getbranch,
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

//branch
branch_router.post("/addbranch", addbranch);
branch_router.get("/getbranch", getbranch);
branch_router.delete("/deletebranch/:branch_id", deletebranch);
export default branch_router;
