const router = require("express").Router();
const multer = require("multer");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");
const pool = require("../config/db");

// ✅ Upload folder setup
const UPLOADS_FOLDER = path.join(__dirname, "..", "..", "public", "uploads");
if (!fs.existsSync(UPLOADS_FOLDER)) fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });

// ✅ Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuid()}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only .png, .jpg, .jpeg, .pdf allowed!"));
  }
});

// ✅ Create question paper
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { className, subject, year } = req.body;
    const file = req.file;

    // ✅ Validations
    if (!className || className.trim() === "")
      return res.status(400).json({ error: "Class name is required" });

    if (!subject || subject.trim() === "")
      return res.status(400).json({ error: "Subject is required" });

    if (!year || year.toString().trim() === "")
      return res.status(400).json({ error: "Year is required" });

    if (!file) return res.status(400).json({ error: "File is required" });

    const yearStr = year.toString().trim();

    // ✅ Insert into DB
    const result = await pool.query(
      `INSERT INTO question_papers
       (class_name, subject_name, year, file_path, file_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [className.trim(), subject.trim(), yearStr, file.filename, `/uploads/${file.filename}`]
    );

    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    console.error("Create Question Paper Error:", err);
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get all question papers
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM question_papers ORDER BY id DESC");
    res.json({ data: result.rows });
  } catch (err) {
    console.error("Get All Question Papers Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get question paper by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM question_papers WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error("Get Question Paper By ID Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete question paper by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Get file path from DB
    const result = await pool.query("SELECT file_path FROM question_papers WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });

    // 2️⃣ Delete physical file
    const filePath = path.join(UPLOADS_FOLDER, result.rows[0].file_path);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    // 3️⃣ Delete DB record
    await pool.query("DELETE FROM question_papers WHERE id=$1", [id]);

    res.json({ message: "Question paper deleted successfully" });
  } catch (err) {
    console.error("Delete Question Paper Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ Update question paper by ID
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const { className, subject, year } = req.body;
    const file = req.file;

    // 1️⃣ Check existing record
    const existing = await pool.query(
      "SELECT * FROM question_papers WHERE id=$1",
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Question paper not found" });
    }

    let filePath = existing.rows[0].file_path;
    let fileUrl = existing.rows[0].file_url;

    // 2️⃣ If new file uploaded → delete old file → save new
    if (file) {
      // delete old file
      const oldFilePath = path.join(UPLOADS_FOLDER, filePath);
      if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);

      // set new file
      filePath = file.filename;
      fileUrl = `/uploads/${file.filename}`;
    }

    const yearStr = year.toString().trim();

    // 3️⃣ Update DB
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

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
