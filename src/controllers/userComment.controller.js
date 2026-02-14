const pool = require("../config/db");




// ✅ Create Comment (Image Optional)
exports.createComment = async (req, res) => {
  try {
    const { chat, name, client, star } = req.body;

    // ✅ Agar image upload hui to path save karo
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO user_comments (chat, name, client, image, star)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [chat, name, client, image, star]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ✅ Get All Comments
exports.getComments = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_comments ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};





// ✅ Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM user_comments WHERE id=$1",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Comment Deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};
