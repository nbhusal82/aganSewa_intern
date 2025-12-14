import db from "../config/dbconn.js";

export const addprovince = async (req, res) => {
  try {
    const { province_name } = req.body;

    if (!province_name) {
      return res.status(400).json({ message: "Province name is required" });
    }

    // check if province already exists
    const [checkProvince] = await db.query(
      "SELECT * FROM province WHERE province_name = ?",
      [province_name]
    );

    if (checkProvince.length > 0) {
      return res.status(400).json({ message: "Province already exists" });
    }

    // insert new province
    await db.query("INSERT INTO province (province_name) VALUES (?)", [
      province_name,
    ]);

    return res.status(201).json({ message: "Province added successfully" });
  } catch (error) {
    console.error(error);
  }
};

export const getprovince = async (req, res) => {
  try {
    const [allprovince] = await db.query("SELECT * FROM province");

    return res.status(200).json({
      message: "All province..",
      data: allprovince,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteprovince = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Province id is required",
      });
    }
    const [rows] = await db.query(
      "SELECT * FROM province WHERE province_id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(400).json({
        message: "Province not found",
      });
    }

    await db.query("DELETE FROM province WHERE province_id = ?", [id]);
    return res.status(200).json({
      message: "Province deleted successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
