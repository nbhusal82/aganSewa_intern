import db from "../config/dbconn.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & Password required!" });

    const [user] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const result = user[0];

    if (result.length === 0) {
      return res.status(400).json({
        message: "Invaild Credenntials",
      });
    }
    const isMatch = await bcrypt.compare(password, result.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invaild Credenntials",
      });
    }
    const token = await jwt.sign(
      {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      },
      process.env.Secretkey,
      {
        expiresIn: process.env.expire,
      }
    );
    res.cookie("token", token);

    // Success bhaye poxe deykine ho..

    res.status(200).json({
      message: "login sucessful",
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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