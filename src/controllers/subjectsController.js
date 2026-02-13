const pool = require("../config/db");

// ✅ Create a new subject with MCQs
exports.createSubject = async (req, res) => {
  try {
    const { subjectName, className, mcqs } = req.body;

    if (!subjectName || subjectName.trim() === "")
      return res.status(400).json({ error: "Subject name is required" });

    if (!className || className.trim() === "")
      return res.status(400).json({ error: "Class name is required" });

    if (!mcqs || !Array.isArray(mcqs) || mcqs.length === 0)
      return res.status(400).json({ error: "MCQs are required" });

    // Insert subject
    const subjectRes = await pool.query(
      "INSERT INTO subjects (subject_name, class_name) VALUES ($1, $2) RETURNING *",
      [subjectName.trim(), className.trim()]
    );
    const subject = subjectRes.rows[0];

    // Insert MCQs linked to this subject
    for (let mcq of mcqs) {
      if (!mcq.question || !mcq.options || !mcq.answer) continue;
      await pool.query(
        "INSERT INTO mcqs (subject_id, question, options, answer) VALUES ($1, $2, $3, $4)",
        [subject.id, mcq.question, mcq.options, mcq.answer]
      );
    }

    res.status(201).json({ message: "Subject created successfully", data: subject });
  } catch (err) {
    console.error("Create Subject Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get all subjects with MCQs
exports.getAllSubjects = async (req, res) => {
  try {
    const subjectsRes = await pool.query("SELECT * FROM subjects ORDER BY id DESC");
    const subjects = [];

    for (let subject of subjectsRes.rows) {
      const mcqsRes = await pool.query("SELECT * FROM mcqs WHERE subject_id=$1", [subject.id]);
      subjects.push({ ...subject, mcqs: mcqsRes.rows });
    }

    res.json({ data: subjects });
  } catch (err) {
    console.error("Get All Subjects Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get a subject by ID with MCQs
exports.getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const subjectRes = await pool.query("SELECT * FROM subjects WHERE id=$1", [id]);

    if (subjectRes.rows.length === 0)
      return res.status(404).json({ error: "Subject not found" });

    const mcqsRes = await pool.query("SELECT * FROM mcqs WHERE subject_id=$1", [id]);

    res.json({ data: { ...subjectRes.rows[0], mcqs: mcqsRes.rows } });
  } catch (err) {
    console.error("Get Subject By ID Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete a subject by ID (MCQs deleted automatically via ON DELETE CASCADE)
exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subjectRes = await pool.query("SELECT * FROM subjects WHERE id=$1", [id]);
    if (subjectRes.rows.length === 0)
      return res.status(404).json({ error: "Subject not found" });

    await pool.query("DELETE FROM subjects WHERE id=$1", [id]);

    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    console.error("Delete Subject Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
