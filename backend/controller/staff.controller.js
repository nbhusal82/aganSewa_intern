import db from "../config/dbconn.js";
import { Apperror } from "../utlis/Apperror.js";

export const createStaff = async (req, res, next) => {
  try {
    const { staff_name, position, role, description, branch_id, services_id } =
      req.body;

    const photo = req.file ? req.file.filename : null;

    // FK check
    const [[branch]] = await db.query(
      "SELECT branch_id FROM branch WHERE branch_id=?",
      [branch_id]
    );
    if (!branch) return Apperror(next, "Invalid branch", 400);

    const [[service]] = await db.query(
      "SELECT services_id FROM services WHERE services_id=?",
      [services_id]
    );
    if (!service) return Apperror(next, "Invalid service", 400);

    const [result] = await db.query(
      `INSERT INTO staff 
      (staff_name, position, photo, role, description, branch_id, services_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [staff_name, position, photo, role, description, branch_id, services_id]
    );

    res.status(201).json({
      message: "Staff created successfully",
      staff_id: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

export const getStaffs = async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, 
             b.branch_name, 
             sv.services_name
      FROM staff s
      JOIN branch b ON s.branch_id = b.branch_id
      JOIN services sv ON s.services_id = sv.services_id
      ORDER BY s.staff_id DESC
    `);

    return res.status(200).json({
      message: "ALL STAFF ..",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteStaff = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [check] = await db.query("SELECT * FROM staff WHERE staff_id=?", [
      id,
    ]);
    if (check.length === 0) {
      return Apperror(next, "Staff not found", 400);
    }

    await db.query("DELETE FROM staff WHERE staff_id=?", [id]);

    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateStaff = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { staff_name, position, role, description, branch_id, services_id } =
      req.body;

    // const photo = req.file ? req.file.filename : null;

    const [check] = await db.query("SELECT * FROM staff WHERE staff_id=?", [
      id,
    ]);

    if (check.length === 0) {
      return Apperror(next, "Staff not found", 404);
    }

    const old = check[0];

    if (branch_id) {
      const [branch] = await db.query(
        "SELECT branch_id FROM branch WHERE branch_id=?",
        [branch_id]
      );
      if (!branch) {
        return Apperror(next, "Invalid branch", 400);
      }
    }

    if (services_id) {
      const [service] = await db.query(
        "SELECT services_id FROM services WHERE services_id=?",
        [services_id]
      );
      if (!service) {
        return Apperror(next, "Invalid service", 400);
      }
    }

    // 3️⃣ Safe update values (NO NULL issue)
    const newStaffName = staff_name || old.staff_name;
    const newPosition = position || old.position;
    const newRole = role || old.role;
    const newDescription = description || old.description;
    const newBranchId = branch_id || old.branch_id;
    const newServicesId = services_id || old.services_id;

    // 4️⃣ Update query
    await db.query(
      `UPDATE staff SET
        staff_name=?,
        position=?,
        role=?,
        description=?,
        branch_id=?,
        services_id=?
       
       WHERE staff_id=?`,
      [
        newStaffName,
        newPosition,
        newRole,
        newDescription,
        newBranchId,
        newServicesId,
        id,
      ]
    );

    res.status(200).json({
      message: "Staff updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
