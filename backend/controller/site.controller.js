import db from "../config/dbconn.js";
import { Apperror } from "../utlis/Apperror.js";
import { removeImage } from "../utlis/removeImg.js";

export const addInquiry = async (req, res, next) => {
  try {
    const { name, phone, address, email, description, branch_id } = req.body;
    if (!name || !phone || !address || !email || !branch_id) {
      return Apperror(next, "All field are Required ", 400);
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

    // Required fields (branch_id admin ko lagi matra)
    if (!title || !location || (role === "admin" && !branch_id)) {
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => removeImage(file.path));
      }
      return Apperror(next, "All fields are required.", 400);
    }

    // Check branch exists
    const [rows] = await db.query("SELECT * FROM branch WHERE branch_id=?", [
      branch_id,
    ]);

    if (rows.length === 0) {
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => removeImage(file.path));
      }
      return Apperror(next, "Branch Id does not exist", 400);
    }

    // Images
    const images = req.files.map((file) => `uploads/gallery/${file.filename}`);
    const image = images.join(",");

    // Insert
    await db.query(
      "INSERT INTO gallery (title, location, branch_id, image) VALUES (?, ?, ?, ?)",
      [title, location, branch_id, image]
    );

    return res.status(200).json({
      message: "Create Gallery Successfully",
    });
  } catch (error) {
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => removeImage(file.path));
    }
    next(error);
  }
};

export const Allgallery = async (req, res, next) => {
  try {
    const { role, branch_id } = req.user;
    let result;

    if (role === "admin") {
      // Admin → all gallery
      [result] = await db.query(
        `SELECT g.*, b.branch_name, b.branch_id
         FROM gallery g
         LEFT JOIN branch b ON g.branch_id = b.branch_id`
      );
    } else {
      // Manager → own branch only
      [result] = await db.query(
        `SELECT g.*, b.branch_name, b.branch_id
         FROM gallery g
         LEFT JOIN branch b ON g.branch_id = b.branch_id
         WHERE g.branch_id = ?`,
        [branch_id]
      );
    }

    return res.status(200).json({
      message: "View Gallery",
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
    const { role, branch_id: userBranchId } = req.user;

    //  gallery exists check
    const [check] = await db.query("SELECT * FROM gallery WHERE gallery_id=?", [
      id,
    ]);

    if (check.length === 0) {
      return Apperror(next, "Gallery not found", 404);
    }

    const old = check[0];

    //  Manager → own branch only
    if (role === "manager" && old.branch_id !== userBranchId) {
      return Apperror(next, "You can update only your branch gallery", 403);
    }

    //  Decide final branch_id
    let finalBranchId = old.branch_id;

    if (role === "admin" && branch_id) {
      // admin le matra branch change garna paune
      const [branch] = await db.query(
        "SELECT branch_id FROM branch WHERE branch_id=?",
        [branch_id]
      );

      if (branch.length === 0) {
        return Apperror(next, "Branch Id does not exist", 400);
      }

      finalBranchId = branch_id;
    }

    //  Image update
    let imagePath = old.image;
    if (req.file) {
      imagePath = `uploads/gallery/${req.file.filename}`;

      if (old.image) {
        removeImage(`uploads/gallery/${old.image.split("/").pop()}`);
      }
    }

    //  Safe values (null issue solve)
    const newTitle = title || old.title;
    const newLocation = location || old.location;

    //  Update query
    await db.query(
      `UPDATE gallery SET
        title=?,
        location=?,
        branch_id=?,
        image=?
       WHERE gallery_id=?`,
      [newTitle, newLocation, finalBranchId, imagePath, id]
    );

    return res.status(200).json({
      message: "Gallery updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGallery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, branch_id: userBranchId } = req.user;

    // gallery exists + branch check
    const [rows] = await db.query(
      "SELECT image, branch_id FROM gallery WHERE gallery_id=?",
      [id]
    );

    if (rows.length === 0) {
      return Apperror(next, "Gallery not found", 404);
    }

    const gallery = rows[0];

    //  Manager → own branch only
    if (role === "manager" && gallery.branch_id !== userBranchId) {
      return Apperror(next, "You can delete only your branch gallery", 403);
    }

    //  remove all images
    const images = gallery.image.split(",");
    images.forEach((img) => removeImage(img));

    //  delete gallery
    await db.query("DELETE FROM gallery WHERE gallery_id=?", [id]);

    return res.status(200).json({
      message: "Gallery deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
