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
import { isadmin } from "../middlewares/isAdmin.js";
import { islogin } from "../middlewares/islogin.js";

const branch_router = express.Router();

branch_router.post("/",islogin, isadmin, addprovince);
branch_router.get("/", islogin,isadmin,getprovince);
branch_router.delete("/:id",islogin,isadmin, deleteprovince);

//district

branch_router.post("/add-dis", islogin, isadmin, add_district);
branch_router.get("/get-dis",islogin,isadmin, get_district);
branch_router.delete("/delete-dis/:id",islogin,isadmin, delete_district);

//branch
branch_router.post("/addbranch", islogin,isadmin,addbranch);
branch_router.get("/getbranch", islogin,getbranch);
branch_router.delete("/deletebranch/:branch_id", islogin,isadmin,deletebranch);
export default branch_router;
