import express from "express";
import { getProfile, updateProfile, changePassword } from "../controller/profile.js";
import { islogin } from "../middlewares/islogin.js";

const router = express.Router();

// @route   GET /api/profile
// @desc    Get current user profile
// @access  Private
router.get("/", islogin, getProfile);

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put("/", islogin, updateProfile);

// @route   PUT /api/profile/password
// @desc    Change user password
// @access  Private
router.put("/password", islogin, changePassword);

export default router;