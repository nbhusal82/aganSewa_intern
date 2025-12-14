import express from "express";
import { addprovince, deleteprovince, getprovince } from "../controller/branch.js";

const branch_router = express.Router();
branch_router.post("/", addprovince);
branch_router.get("/", getprovince);
branch_router.delete("/:id", deleteprovince);

export default branch_router;
