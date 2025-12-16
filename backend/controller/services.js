import { Apperror } from "../utlis/Apperror.js";
import db from "../config/dbconn.js";

export const addservices = async (req, res, next) => {
  try {
    const { services_name, branch_id, description } = req.body;
    console.log(req.body);
    if (!services_name || !branch_id || !description) {
      return Apperror(next, "All Filed are Required", 400);
    }
    const [branch_check] = await db.query(
      "SELECT * FROM branch WHERE branch_id = ?",
      [branch_id]
    );
    if (branch_check.length === 0) {
      return Apperror(next, "Branch Id is Not Found", 400);
    }
    await db.query(
      "INSERT INTO services (services_name,description,branch_id) VALUES ( ? ,? ,? )",
      [services_name, description, branch_id]
    );
    return res.status(200).json({
      message: "Service Add Successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const AllService = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT s.services_name ,s.services_id,
      s.description ,
      b.branch_id , b.branch_name from services s LEFT JOIN branch b ON s.branch_id=b.branch_id`
    );
    return res.status(200).json({
      message: "All Service ..",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

export const DeleteService = async (req, res, next) => {
  try {
    const { services_id } = req.params;
    if (!services_id) {
      return Apperror(next, "Services id is not exists", 400);
    }
    await db.query("DELETE FROM services WHERE services_id=?", [services_id]);
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
    await db.query(
      "UPDATE services SET services_name = ? , description = ? WHERE services_id = ? ",
      [newname, newdescription, id]
    );
    return res.status(200).json({
      message: "Update Service Successfull",
    });
  } catch (error) {
    next(error);
  }
};
