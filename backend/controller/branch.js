import db from "../config/dbconn.js";
import { Apperror } from "../utlis/Apperror.js";

export const addprovince = async (req, res, next) => {
  try {
    const { province_name } = req.body;

    if (!province_name) {
      return Apperror(next, "province name is required", 400);
    }

    // check if province already exists
    const [checkProvince] = await db.query(
      "SELECT * FROM province WHERE province_name = ?",
      [province_name]
    );

    if (checkProvince.length > 0) {
      return Apperror(next, "Province already exists", 400);
    }

    // insert new province
    await db.query("INSERT INTO province (province_name) VALUES (?)", [
      province_name,
    ]);

    return res.status(201).json({ message: "Province added successfully" });
  } catch (error) {
    next(error);
  }
};

export const getprovince = async (req, res, next) => {
  try {
    const [allprovince] = await db.query(
      `SELECT p.province_id,p.province_name ,GROUP_CONCAT(d.district_name) as district from province p LEFT JOIN district d ON p.province_id = d.province_id   GROUP BY p.province_id,p.province_name`
    );
    return res.status(200).json({
      message: "All province..",
      data: allprovince,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteprovince = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [check] = await db.query(
      "SELECT * FROM province WHERE province_id = ?",
      [id]
    );
    if (check.length === 0) {
      return Apperror(next, "Province not found", 400);
    }

    await db.query("DELETE FROM province WHERE province_id = ?", [id]);
    return res.status(200).json({
      message: "Province deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

//district
export const add_district = async (req, res, next) => {
  try {
    const { district_name, province_id } = req.body;

    if (!district_name || !province_id) {
      return Apperror(next, "District and province id is required", 400);
    }
    const [province] = await db.query(
      "SELECT * FROM province WHERE province_id = ?",
      [province_id]
    );
    if (province.length === 0) {
      return Apperror(next, "Province  is not found", 400);
    }

    // check if district already exists
    const [checkDistrict] = await db.query(
      "SELECT * FROM district WHERE district_name = ? ",
      [district_name]
    );

    if (checkDistrict.length > 0) {
      return Apperror(next, "district already exists", 400);
    }

    // insert new district
    await db.query(
      "INSERT INTO district (district_name, province_id) VALUES (?, ?)",
      [district_name, province_id]
    );

    return res.status(201).json({ message: "District added successfully" });
  } catch (error) {
    next(error);
  }
};

export const get_district = async (req, res, next) => {
  try {
    const [alldistrict] = await db.query("SELECT * FROM district");
    return res.status(201).json({
      message: "available district..",
      data: alldistrict,
    });
  } catch (error) {
    next(error);
  }
};

export const delete_district = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return Apperror(next, "District is requried", 400);
    }
    const [rows] = await db.query("SELECT *FROM district WHERE district_id=?", [
      id,
    ]);
    if (rows.length === 0) {
      return Apperror("district not found", 400);
    }
    await db.query("DELETE FROM district WHERE district_id=?", [id]);
    return res.status(200).json({
      message: "District delete successfully",
    });
  } catch (error) {
    next(error);
  }
};

// branch
export const addbranch = async (req, res, next) => {
  try {
    const { branch_name, district_id, Remark } = req.body;
    // console.log(req.body);
    if (!branch_name | !district_id) {
      return Apperror(next, "ALL Filed are Required..", 400);
    }
    const [rows] = await db.query(
      "SELECT * FROM district WHERE district_id=?",
      [district_id]
    );
    if (rows.length === 0) {
      return Apperror(next, "district not found", 400);
    }
    await db.query(
      "INSERT INTO branch (branch_name,district_id,Remark)values(? ,? ,?)",
      [branch_name, district_id, Remark]
    );
    return res.status(201).json({
      message: "Branch add Successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const getbranch = async (req, res, next) => {
  try {
    const [allbranch] = await db.query(`SELECT 
      b.branch_name,b.branch_id,b.Remark ,d.district_name
      FROM branch b 
      LEFT JOIN district d
      ON b.district_id=d.district_id`);
    return res.status(200).json({
      message: "ALL branch ",
      data: allbranch,
    });
  } catch (error) {
    next(error);
  }
};

export const deletebranch = async (req, res, next) => {
  try {
    const { branch_id } = req.params;


    if (!branch_id) {
      return Apperror(next, "Branch ID is required", 400);
    }

    const [checks] = await db.query(
      "SELECT branch_id FROM branch WHERE branch_id = ?",
      [branch_id]
    );

    if (checks.length === 0) {
      return Apperror(next, "Branch not found", 404);
    }

    await db.query("DELETE FROM branch WHERE branch_id = ?", [branch_id]);

    return res.status(200).json({
      message: "Branch deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
