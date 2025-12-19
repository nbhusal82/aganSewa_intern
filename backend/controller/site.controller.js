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

//gallery
export const addgallery = async (req, res, next) => {
  try {
    const { title, location, branch_id } = req.body;
    // const{imagePath} = req.files;
    if (!title || !location || !branch_id) {
      return Apperror(next, "All Field are required.", 400);
    }
    const [rows] = await db.query("SELECT * FROM  branch WHERE branch_id=?", [
      branch_id,
    ]);
    if (rows.length === 0) {
      return Apperror(next, "Branch Id is not exists", 400);
    }
    const imagePath = `uploads/gallery/${req.files[0].filename}`;

    await db.query(
      "insert into gallery (title,location,branch_id,image) values (?,?,?,?)",
      [title, location, branch_id, imagePath]
    );
    return res.status(200).json({
      message: "Create Gallery Successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const Allgallery = async (req, res, next) => {
  try {
    const [result] = await db.query(
      "SELECT g.* ,b.branch_name, b.branch_id FROM gallery g LEFT JOIN branch b ON g.branch_id=b.branch_id"
    );
    res.status(200).json({
      message: "View All Images..",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const updateGallery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, location, branch_id } = req.body;

    // 1️⃣ gallery exists check
    const [check] = await db.query("SELECT * FROM gallery WHERE gallery_id=?", [
      id,
    ]);

    if (check.length === 0) {
      return Apperror(next, "Gallery not found", 404);
    }

    const old = check[0];

    // 2️⃣ branch validation (only if provided)
    if (branch_id) {
      const [branch] = await db.query(
        "SELECT branch_id FROM branch WHERE branch_id=?",
        [branch_id]
      );
      if (branch.length === 0) {
        return Apperror(next, "Branch Id does not exist", 400);
      }
    }

    let imagePath = old.image;
    if (req.file) {
      updatedImage = `uploads/gallery/${req.file.filename}`;

      if (check[0].image) {
        removeImage(`uploads/gallery/${check[0].image.split("/").pop()}`);
      }
    }

    // 4️⃣ safe values (NO NULL issue)
    const newTitle = title || old.title;
    const newLocation = location || old.location;
    const newBranchId = branch_id || old.branch_id;

    // 5️⃣ update query
    await db.query(
      `UPDATE gallery SET
        title=?,
        location=?,
        branch_id=?,
        image=?
       WHERE gallery_id=?`,
      [newTitle, newLocation, newBranchId, imagePath, id]
    );

    return res.status(200).json({
      message: "Gallery updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
