const router = require("express").Router();
const multer = require("multer");
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");

const questionPaperClass12Controller = require("../controllers/questionPapersClass12.controller");
 
const UPLOADS_FOLDER = path.join(__dirname, "..", "..", "public", "uploads");
if (!fs.existsSync(UPLOADS_FOLDER)) fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });

// Multer storage
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

// Routes
router.post("/", upload.single("file"), questionPaperClass12Controller.createQuestionPaperClass12);
router.get("/", questionPaperClass12Controller.getAllQuestionPapersClass12);
router.get("/:id", questionPaperClass12Controller.getQuestionPaperByIdClass12);
router.delete("/:id", questionPaperClass12Controller.deleteQuestionPaperClass12);

module.exports = router;
