import express from "express";
import {
  addgallery,
  addInquiry,
  Allgallery,
  AllInquiry,
  createReview,
  deleteGallery,
  deleteinquiry,
  getReview,
  updateGallery,
} from "../controller/site.controller.js";
import { uploadgallery } from "../utlis/multer.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import { BranchAccess } from "../middlewares/branchAccess.js";
import { islogin } from "../middlewares/islogin.js";
const site_router = express.Router();
site_router.post("/", islogin, addInquiry);
site_router.get("/",islogin, AllInquiry);
site_router.delete("/:id",islogin, deleteinquiry);

//create review
site_router.post("/review",islogin, createReview);
site_router.get("/review/get",islogin, getReview);

//gallery
site_router.post(
  "/gallery",
  islogin,
  authorizeRoles("manager"),
  uploadgallery.array("image", 30),
  BranchAccess,
  addgallery
);
site_router.get("/gallery/get", Allgallery);
site_router.patch(
  "/gallery/update/:id",islogin,
  uploadgallery.array("image", 30),
  updateGallery
);
site_router.delete(
  "/gallery/delete/:id",islogin,
  uploadgallery.array("image", 30),
  deleteGallery
);

export default site_router;
