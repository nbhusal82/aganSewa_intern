import db from "../config/dbconn.js";
import { Apperror } from "../utlis/Apperror.js";

export const addInquiry = async (req, res, next) => {
  try {
    const { name, phone, address, email, description, branch_id } = req.body;
    if (!name || !phone || !address || !email || !branch_id) {
      return Apperror(next, "All field are Required ", 400);
    }
    const [check_phone] = await db.query(
      "SELECT * from inquiry WHERE phone=?",
      [phone]
    );
    if (check_phone.length > 0) {
      return Apperror(next, "Phone is already Exists", 400);
    }

    await db.execute(
      "INSERT INTO inquiry(name,phone,address,email,description,branch_id) VALUES(?,?,?,?,?,?)",
      [name, phone, address, email, description, branch_id]
    );
    return res.status(200).json({
      message: "Inquiry Add  succesfully ",
    });
  } catch (error) {
    next(error);
  }
};

export const AllInquiry = async (req, res, next) => {
  try {
    const [rows] = await db.query(`SELECT i.name, i.phone,
            i.email,i.description,i.address,b.branch_id,b.branch_name from inquiry i LEFT JOIN branch b ON i.branch_id=b.branch_id`);

    return res.status(200).json({
      message: "Get All Inquiry",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteinquiry = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return Apperror(next, "Inquiry Id is not Found", 400);
    }
    await db.query("DELETE  FROM inquiry WHERE inquiry_id = ?", [id]);
    return res.status(200).json({
      message: "Delete Inquiry Sucessfully",
    });
  } catch (error) {
    next(error);
  }
};

//review

export const createReview = async (req, res, next) => {
  try {
    const { name, position, description } = req.body;
    if (!name || !position || !description) {
      return Apperror(next, "All filed are Required..", 400);
    }

    await db.query(
      "INSERT INTO review (name, position, description) VALUES (?, ?, ?)",
      [name, position, description]
    );

    res.status(200).json({
      message: "Review created successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const getReview = async (req, res, next) => {
  try {
    const [rows] = await db.query("SELECT * FROM review");
    return res.status(200).json({
      message: "GET Review.",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};


