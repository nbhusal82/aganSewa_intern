import db from "../config/dbconn.js";
import { Apperror } from "../utlis/Apperror.js";
import bcrypt from "bcrypt";

// Get current user profile
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.user_id; // from auth middleware
    
    console.log('Get Profile Request - User ID:', userId);
    console.log('Full req.user:', req.user);
    
    const [user] = await db.execute(
      "SELECT user_id, name, email, role FROM users WHERE user_id = ?",
      [userId]
    );

    console.log('User query result:', user);

    if (user.length === 0) {
      console.log('User not found in database');
      return Apperror(next, "User not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: user[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { name, email } = req.body;

    console.log('Update Profile Request:');
    console.log('User ID:', userId);
    console.log('Request Body:', { name, email });
    console.log('Full req.user:', req.user);

    // Validation
    if (!name || !email) {
      console.log('Validation failed: Missing name or email');
      return Apperror(next, "Name and email are required", 400);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Email validation failed:', email);
      return Apperror(next, "Please provide a valid email", 400);
    }

    // Check if email already exists (excluding current user)
    const [existingUser] = await db.query(
      "SELECT user_id FROM users WHERE email = ? AND user_id != ?",
      [email.toLowerCase(), userId]
    );
    
    console.log('Existing user check:', existingUser);
    
    if (existingUser.length > 0) {
      console.log('Email already exists');
      return Apperror(next, "Email already in use by another user", 400);
    }

    // Update user
    console.log('Updating user with:', { name: name.trim(), email: email.toLowerCase(), userId });
    
    const [updateResult] = await db.execute(
      "UPDATE users SET name = ?, email = ? WHERE user_id = ?",
      [name.trim(), email.toLowerCase(), userId]
    );
    
    console.log('Update result:', updateResult);

    // Get updated user data
    const [updatedUser] = await db.execute(
      "SELECT user_id, name, email, role FROM users WHERE user_id = ?",
      [userId]
    );
    
    console.log('Updated user data:', updatedUser);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    next(error);
  }
};

// Change user password
export const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return Apperror(next, "Current password and new password are required", 400);
    }

    if (newPassword.length < 6) {
      return Apperror(next, "New password must be at least 6 characters long", 400);
    }

    // Get user with password
    const [user] = await db.query(
      "SELECT user_id, password FROM users WHERE user_id = ?",
      [userId]
    );
    
    if (user.length === 0) {
      return Apperror(next, "User not found", 404);
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user[0].password);
    if (!isMatch) {
      return Apperror(next, "Current password is incorrect", 400);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await db.query(
      "UPDATE users SET password = ? WHERE user_id = ?",
      [hashedPassword, userId]
    );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    next(error);
  }
};