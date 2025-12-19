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

    const user = users[0];

    //  password must exist
    if (!user.password) {
      return Apperror(next, "Password not set for this user", 500);
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
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.Secretkey,
      {
        expiresIn: process.env.expire,
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // production ma true
      sameSite: "lax",
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
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
    const { name, email, password, role, branch_id } = req.body;
    if (!name || !email || !password || !role) {
      return Apperror(next, "All Filed are Required", 400);
    }
    const [check_branch] = await db.query(
      "SELECT * FROM branch WHERE branch_id=?",
      [branch_id]
    );
    if (check_branch.length === 0) {
      return Apperror(next, "Branch id is not found ", 400);
    }
    await db.query("INSERT INTO ")
  } catch (error) {}
};
