import db from "../config/dbconn.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Apperror } from "../utlis/Apperror.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return Apperror(next, "Email & Password required!", 400);
    }

    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // user check
    if (users.length === 0) {
      return Apperror(next, "Invalid Credentials", 400);
    }

    const [branch] = await db.execute(
      `SELECT u.name,u.user_id,u.email,u.role,b.branch_name FROM users u LEFT JOIN branch b ON u.branch_id=b.branch_id WHERE u.email=?`,
      [email]
    );
    if (branch.length === 0) {
      return Apperror(next, "No branch assigned to this user", 400);
    }

    const user = users[0];

    //  password must exist
    if (!user.password) {
      return Apperror(next, "Password not set for this user", 400);
    }

    const isMatch = await bcrypt.compare(
      String(password),
      String(user.password)
    );

    if (!isMatch) {
      return Apperror(next, "Invalid Credentials", 400);
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch_id: user.branch_id,
      },
      process.env.Secretkey,
      {
        expiresIn: process.env.expire,
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // production ma true
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch_name: branch[0].branch_name,
        branch_id: user.branch_id,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "logout success",
    });
  } catch (error) {
    next(error);
  }
};
// admin -addbranchmanager(branch_id,branch_email,branch_password,role)

export const addbranchmanager = async (req, res, next) => {
  try {
    const { name, email, password, branch_id } = req.body;
    if (!name || !email || !password || !branch_id) {
      return Apperror(next, "All Filed are Required", 400);
    }
    const [check_branch] = await db.query(
      "SELECT * FROM branch WHERE branch_id=?",
      [branch_id]
    );
    if (check_branch.length === 0) {
      return Apperror(next, "Branch id is not found ", 400);
    }
    const [check_mail] = await db.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    if (check_mail.length > 0) {
      return Apperror(next, "Email already exists", 400);
    }
    const [rows] = await db.query("SELECT * FROM USERS WHERE   branch_id=?", [
      branch_id,
    ]);
    if (rows.length > 0) {
      return Apperror(
        next,
        "Branch manager already exists for this branch",
        400
      );
    }
    await db.query(
      "INSERT INTO users (name, email, password, branch_id) VALUES ( ?, ?, ?, ?)",
      [name, email, password, branch_id]
    );
    res.status(201).json({
      status: "success",
      message: "Branch manager added successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const getmanagers = async (req, res, next) => {
  try {
    const [managers] = await db.query(
      "SELECT user_id,name,email,role,branch_id FROM users WHERE role=?",
      ["manager"]
    );

    res.status(200).json({
      status: "success",
      data: managers,
    });
  } catch (error) {
    next(error);
  }
};
export const deletemanager = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await db.query(
      "DELETE FROM users WHERE user_id = ? AND role = ?",
      [id, "manager"]
    );

    if (result.length === 0) {
      return Apperror(next, "Manager not found  cannot be deleted", 404);
    }
    res.status(200).json({
      status: "success",
      message: "Manager deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateManager = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, branch_id } = req.body;

    // 1. Check manager exists
    const [users] = await db.execute(
      "SELECT * FROM users WHERE user_id = ? AND role='manager'",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const oldData = users[0];

    const [emailCheck] = await db.execute(
      "SELECT user_id FROM users WHERE email = ? AND user_id != ?",
      [email, id]
    );

    if (emailCheck.length > 0) {
      return Apperror(next, "Email already in use", 400);
    }

    if (branch_id) {
      const [branch] = await db.execute(
        "SELECT branch_id FROM branch WHERE branch_id = ?",
        [branch_id]
      );

      if (branch.length === 0) {
        return res.status(404).json({ message: "Branch not found" });
      }
    }

    const updateName = name ?? oldData.name;
    const updateEmail = email ?? oldData.email;
    const updateBranchId = branch_id ?? oldData.branch_id;

    // 5. Update manager
    await db.execute(
      `UPDATE users 
       SET name = ?, email = ?, branch_id = ?
       WHERE user_id = ?`,
      [updateName, updateEmail, updateBranchId, id]
    );

    return res.status(200).json({
      message: "Manager updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
