import express from "express";
import {
  addservices,
  AllService,
  DeleteService,
  updateService,
} from "../controller/services.js";
import { uploadservice } from "../utlis/multer.js";

const service_Router = express.Router();
service_Router.post("/", uploadservice.single("image"), addservices);
service_Router.get("/get", AllService);
service_Router.delete("/delete/:services_id", DeleteService);
service_Router.patch(
  "/update/:id",
  uploadservice.single("image"),
  updateService
);

export default service_Router;
