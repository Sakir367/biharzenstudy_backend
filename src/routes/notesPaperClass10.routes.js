const router = require("express").Router();
const multer = require("multer");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");

// ✅ Import the controller object correctly
const notesClass10Controller = require("../controllers/notesClass10.controller");

const UPLOADS_FOLDER = path.join(__dirname, "..", "..", "public", "uploads");
if (!fs.existsSync(UPLOADS_FOLDER)) fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });

// ✅ Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) => cb(null, `${uuid()}${path.extname(file.originalname)}`)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only .png, .jpg, .jpeg, .pdf allowed!"));
  }
});

// ✅ Routes
router.post("/", upload.single("file"), notesClass10Controller.createNotesPaperClass10);
router.get("/", notesClass10Controller.getAllNotesClass10);
router.get("/:id", notesClass10Controller.getNotesByIdClass10);
router.delete("/:id", notesClass10Controller.deleteNotesPaperClass10);

module.exports = router;
