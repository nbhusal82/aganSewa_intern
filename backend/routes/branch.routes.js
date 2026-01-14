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
  updatebranch,
  GetProvienceById,
  getPDB,
  getalldistrict,
  getBranchByDistrict,
} from "../controller/branch.js";

import { islogin } from "../middlewares/islogin.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const branch_router = express.Router();

branch_router.post("/", islogin, authorizeRoles("admin"), addprovince);
branch_router.get("/", islogin, authorizeRoles("admin"), getprovince);

branch_router.delete("/:id", islogin, authorizeRoles("admin"), deleteprovince);
branch_router.get(
  "getprovienceid/:id",
  islogin,
  authorizeRoles("admin"),
  GetProvienceById
);

//district

branch_router.post("/add-dis", islogin, authorizeRoles("admin"), add_district);
branch_router.get(
  "/get-dis",
  islogin,
  authorizeRoles("admin", "manager"),

  get_district
);
branch_router.get(
  "/getalldistrict",

  getalldistrict
);

branch_router.delete(
  "/delete-dis/:id",
  islogin,
  authorizeRoles("admin", "manager"),

  delete_district
);
branch_router.get("/branchdistrict/:id", getBranchByDistrict);

//branch
branch_router.post("/addbranch", islogin, authorizeRoles("admin"), addbranch);
branch_router.get(
  "/getbranch",
  islogin,
  authorizeRoles("admin", "manager"),
  getbranch
);
branch_router.patch(
  "/updatebranch/:branch_id",
  islogin,
  authorizeRoles("admin", "manager"),
  updatebranch
);
branch_router.delete(
  "/deletebranch/:branch_id",
  islogin,
  authorizeRoles("admin", "manager"),
  deletebranch
);

branch_router.get("/pdb", islogin, authorizeRoles("admin", "manager"), getPDB);

export default branch_router;
