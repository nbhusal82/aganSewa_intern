import express from "express";
import {
  addservices,
  AllService,
  DeleteService,
  updateService,
} from "../controller/services.js";

const service_Router = express.Router();
service_Router.post("/", addservices);
service_Router.get("/get", AllService);
service_Router.delete("/delete/:services_id", DeleteService);
service_Router.patch("/update/:id", updateService);

export default service_Router;
