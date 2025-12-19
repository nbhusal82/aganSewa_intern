import jwt from "jsonwebtoken";
import { Apperror } from "../utlis/Apperror.js";
export const islogin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return Apperror(next, "you must be login ", 400);
    }

    const decoded = jwt.verify(token, process.env.Secret_key);
    // console.log(decoded);
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
  }
};
