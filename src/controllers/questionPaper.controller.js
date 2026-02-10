// controllers/questionPaperController.js
const pool = require("../config/db");
const path = require("path");
const fs = require("fs");

// CREATE QUESTION PAPER
exports.createQuestionPaper = async (req, res) => {
  try {
    const { className, subject, year } = req.body;
    const file = req.file;

    // Validate required fields
    if (!className || className.trim() === "") {
      return res.status(400).json({ error: "Class name is required" });
    }
    if (!subject || subject.trim() === "") {
      return res.status(400).json({ error: "Subject is required" });
    }
   if (!year || year.toString().trim() === "") {
  return res.status(400).json({ error: "Year is required" });
}
    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }

  const yearStr = year.toString().trim();

    

    // File URL for frontend
    const fileUrl = `/uploads/${file.filename}`;

    // Insert into database
    const result = await pool.query(
      `INSERT INTO question_papers
       (class_name, subject_name, year, file_path, file_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [className.trim(), subject.trim(), yearStr, file.filename, fileUrl]
    );

    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    console.error("Create Question Paper Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET ALL QUESTION PAPERS
exports.getAllQuestionPapers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM question_papers ORDER BY id DESC"
    );
    res.json({ data: result.rows });
  } catch (err) {
    console.error("Get All Question Papers Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET QUESTION PAPER BY ID
exports.getQuestionPaperById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM question_papers WHERE id=$1",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Not found" });
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error("Get Question Paper By ID Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// DELETE QUESTION PAPER
exports.deleteQuestionPaper = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Get file name from DB
    const result = await pool.query(
      "SELECT file_path FROM question_papers WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Question paper not found" });

    // 2️⃣ Delete file from public/uploads
    const filePath = path.join(__dirname, "..", "..", "public", "uploads", result.rows[0].file_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // 3️⃣ Delete record from DB
    await pool.query("DELETE FROM question_papers WHERE id=$1", [id]);

    res.json({ message: "Question paper deleted successfully" });
  } catch (err) {
    console.error("Delete Question Paper Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.updateQuestionPaper = async (req, res) => {
  try {
    const { id } = req.params;
    const { className, subject, year } = req.body;
    const file = req.file;

    const existing = await pool.query(
      "SELECT * FROM question_papers WHERE id=$1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Question paper not found" });
    }

    let filePath = existing.rows[0].file_path;
    let fileUrl = existing.rows[0].file_url;

    if (file) {
      const oldFilePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "uploads",
        filePath
      );

      if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);

      filePath = file.filename;
      fileUrl = `/uploads/${file.filename}`;
    }

    const yearStr = year.toString().trim();

    const result = await pool.query(
      `UPDATE question_papers
       SET class_name=$1,
           subject_name=$2,
           year=$3,
           file_path=$4,
           file_url=$5
       WHERE id=$6
       RETURNING *`,
      [
        className.trim(),
        subject.trim(),
        yearStr,
        filePath,
        fileUrl,
        id,
      ]
    );

    res.json({ data: result.rows[0] });

  } catch (err) {
    console.error("Update Question Paper Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
