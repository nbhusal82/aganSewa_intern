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
const site_router = express.Router();
site_router.post("/", addInquiry);
site_router.get("/", AllInquiry);
site_router.delete("/:id", deleteinquiry);

//create review
site_router.post("/review", createReview);
site_router.get("/review/get", getReview);

//gallery
site_router.post("/gallery", uploadgallery.array("image", 30), addgallery);
site_router.get("/gallery/get", Allgallery);
site_router.patch(
  "/gallery/update/:id",
  uploadgallery.array("image", 30),
  updateGallery
);
site_router.delete("/gallery/delete/:id",uploadgallery.array("image",30), deleteGallery);

export default site_router;
