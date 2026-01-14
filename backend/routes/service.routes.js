import express from "express";
import {
  addservices,
  AllService,
  DeleteService,
  getservice,
  updateService,
} from "../controller/services.js";
import { uploadservice } from "../utlis/multer.js";
import { islogin } from "../middlewares/islogin.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { branchAccess } from "../middlewares/branchAccess.js";

const service_Router = express.Router();
service_Router.post(
  "/",
  islogin,

  authorizeRoles("manager", "admin"),
  uploadservice.single("image"),
  branchAccess,
  addservices
);
service_Router.get(
  "/get",
  islogin,
  authorizeRoles("manager", "admin"),

  AllService
);
service_Router.delete(
  "/delete/:services_id",
  islogin,
  authorizeRoles("manager", "admin"),

  DeleteService
);
service_Router.patch(
  "/update/:id",
  islogin,
  authorizeRoles("manager", "admin"),
  uploadservice.single("image"),
  branchAccess,
  updateService
);

service_Router.get("/publicservice/:branch_id", getservice);

export default service_Router;
