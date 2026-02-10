const router = require("express").Router();
const multer = require("multer");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");

// ✅ Import the controller object correctly
const notesClass12Controller = require("../controllers/notesClass12.controller");

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
router.post("/", upload.single("file"), notesClass12Controller.createNotesPaperClass12);
router.get("/", notesClass12Controller.getAllNotesClass12);
router.get("/:id", notesClass12Controller.getNotesByIdClass12);
router.delete("/:id", notesClass12Controller.deleteNotesPaperClass12);

module.exports = router;
