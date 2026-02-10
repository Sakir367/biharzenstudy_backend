const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const questionPaperRoutes = require("./routes/questionPaper.routes");
const questionPapersClass12 = require("./routes/questionPapersClass12.routes.js");
const NotesPapersClass10 = require("./routes/notesPaperClass10.routes.js");
const NotesPapersClass12 = require("./routes/notesPaperClass12.routes.js");
const app = express();
const path = require("path");

// CORS + JSON
app.use(cors());
app.use(express.json());

// 🔹 Ye line
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.send("Backend is Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questionpapers", questionPaperRoutes);
app.use("/api/class12", questionPapersClass12);
app.use("/api/notes/class10", NotesPapersClass10);
app.use("/api/notes/class12", NotesPapersClass12);
module.exports = app;

