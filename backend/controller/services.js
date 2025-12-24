import { Apperror } from "../utlis/Apperror.js";
import db from "../config/dbconn.js";
import { removeImage } from "../utlis/removeImg.js";
import { serialize } from "v8";

export const addservices = async (req, res, next) => {
  try {
    const { services_name, description, branch_id } = req.body;

    // console.log(typeof branchId);

    //  Required fields
    if (!services_name || !description) {
      if (req.file) removeImage(req.file.path);
      return Apperror(next, "All fields are required", 400);
    }

    // Get manager branch

    // Check branch exists
    const [branch] = await db.query(
      "SELECT branch_id FROM branch WHERE branch_id = ?",
      [branchId]
    );

    if (branch.length === 0) {
      return Apperror(next, "Branch not found", 400);
    }

    // console.log(.branch_id);

    //  Image
    const imagePath = req.file ? `uploads/service/${req.file.filename}` : null;

    //  Insert (branch_id from DB, NOT body)
    await db.query(
      "INSERT INTO services (services_name, description, branch_id, image) VALUES (?, ?, ?, ?)",
      [services_name, description, branch_id, imagePath]
    );

    return res.status(200).json({
      message: "Service added successfully",
    });
  } catch (error) {
    if (req.file) removeImage(req.file.path);
    next(error);
  }
};

export const AllService = async (req, res, next) => {
  try {
    const { role, email } = req.user;

    if (role === "admin") {
      const [rows] = await db.query(
        `SELECT s.*,
       
      b.branch_id , b.branch_name from services s LEFT JOIN branch b ON s.branch_id=b.branch_id`
      );
      return res.status(200).json({
        message: "All Service ..",
        data: rows,
      });
    }
    if (role === "manager") {
      const [id] = await db.query("SELECT branch_id From users where email=?", [
        email,
      ]);
      const branch_id = id[0].branch_id;
      const [rows] = await db.query(
        "SELECT * FROM services WHERE branch_id=?",
        [branch_id]
      );

      return res.status(200).json({
        message: "All Service ..",
        data: rows,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const DeleteService = async (req, res, next) => {
  try {
    const { services_id } = req.params;
    const { role, email } = req.user;

    if (role !== "manager") {
      return Apperror(next, "Manager only Access.", 400);
    }
    const [user] = await db.query(
      "SELECT branch_id FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return Apperror(next, "User not found", 404);
    }

    const [service] = await db.query(
      "SELECT * FROM services WHERE services_id=?",
      [services_id]
    );
    if (service.length === 0) {
      return Apperror(next, "Services id is not exists", 400);
    }
    await db.query("DELETE FROM services WHERE services_id = ?", [services_id]);
    return res.status(200).json({
      message: "Services delete Sucessfully",
    });
  } catch (error) {
    next(error);
  }
};
export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { services_name, description } = req.body;

    const [check] = await db.query(
      "SELECT * FROM services WHERE services_id=?",
      [id]
    );
    if (check.length === 0) {
      return Apperror(next, "Service not found", 400);
    }
    const news = check[0];
    const newname = services_name || news.services_name;
    const newdescription = description || news.description;

    let updatedImage = news.image;
    if (req.file) {
      updatedImage = `uploads/service/${req.file.filename}`;

      if (check[0].image) {
        removeImage(`uploads/service/${check[0].image.split("/").pop()}`);
      }
    }

    await db.query(
      "UPDATE services SET services_name = ? , description = ?  , image=? WHERE services_id = ? ",
      [newname, newdescription, updatedImage, id]
    );
    return res.status(200).json({
      message: "Update Service Successfull",
    });
  } catch (error) {
    next(error);
  }
};
export const getservice = async (req, res, next) => {
  const { province_id, district_id, branch_id } = req.query;
  console.log(req.query);

  try {
    let query = "";
    let params = [];
    if (province_id && !district_id && !branch_id) {
      query = "SELECT * FROM district where province_id = ?";
      params = [province_id];
    } else if (province_id && district_id && !branch_id) {
      query = "SELECT * FROM branch where district_id=?";
      params = [district_id];
    } else if (province_id && district_id && branch_id) {
      query = "SELECT * FROM services where branch_id=?";
      params = [branch_id];
    } else {
      query = "SELECT * From services ";
    }
    const [result] = await db.query(query, params);
    res.status(200).json({
      message: "Data fatch",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
