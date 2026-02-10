const pool = require("../config/db");
const path = require("path");
const fs = require("fs");

const UPLOADS_FOLDER = path.join(__dirname, "..", "..", "public", "uploads");

// ✅ CREATE NOTES CLASS 10
exports.createNotesPaperClass10 = async (req, res) => {
  try {
    const { className, subject, year } = req.body;
    const file = req.file;

    if (!className || className.trim() === "")
      return res.status(400).json({ error: "Class name is required" });

    if (!subject || subject.trim() === "")
      return res.status(400).json({ error: "Subject is required" });

    if (!year || year.toString().trim() === "")
      return res.status(400).json({ error: "Year is required" });

    if (!file)
      return res.status(400).json({ error: "File is required" });

    const yearStr = year.toString().trim();

    const result = await pool.query(
      `INSERT INTO notes_papers_class10
       (class_name, subject_name, year, file_path, file_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        className.trim(),
        subject.trim(),
        yearStr,
        file.filename,
        `/uploads/${file.filename}`
      ]
    );

    res.status(201).json({ data: result.rows[0] });

  } catch (err) {
    console.error("Create Notes Class10 Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ GET ALL
exports.getAllNotesClass10 = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notes_papers_class10 ORDER BY id DESC"
    );
    res.json({ data: result.rows });

  } catch (err) {
    console.error("Get All Notes Class10 Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ GET BY ID
exports.getNotesByIdClass10 = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM notes_papers_class10 WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Not found" });

    res.json({ data: result.rows[0] });

  } catch (err) {
    console.error("Get Notes By Id Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ DELETE
exports.deleteNotesPaperClass10 = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT file_path FROM notes_papers_class10 WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Not found" });

    // Delete file
    const filePath = path.join(UPLOADS_FOLDER, result.rows[0].file_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // Delete DB record
    await pool.query(
      "DELETE FROM notes_papers_class10 WHERE id=$1",
      [id]
    );

    res.json({ message: "Notes deleted successfully" });

  } catch (err) {
    console.error("Delete Notes Class10 Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
