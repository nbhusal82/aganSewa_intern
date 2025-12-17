import express from "express";
import {
  addInquiry,
  AllInquiry,
  createReview,
  deleteinquiry,
  getReview,
} from "../controller/site.controller.js";
const site_router = express.Router();
site_router.post("/", addInquiry);
site_router.get("/", AllInquiry);
site_router.delete("/:id", deleteinquiry);

//create review
site_router.post("/review", createReview);
site_router.get("/review/get", getReview);

export default site_router;
