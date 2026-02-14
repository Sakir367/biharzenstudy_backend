const router = require("express").Router();

const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { v4: uuid } = require("uuid");

// ✅ Import Controller
const subjectsController = require("../controllers/userComment.controller");


// ✅ Upload Folder Path
const UPLOADS_FOLDER = path.join(__dirname, "..", "..", "public", "uploads");

// ✅ Folder create if not exists
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
}


// ✅ Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_FOLDER),
  filename: (req, file, cb) => {
    cb(null, `${uuid()}${path.extname(file.originalname)}`);
  },
});


// ✅ Multer Config
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "application/pdf",
    ];

    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only .png, .jpg, .jpeg, .pdf allowed!"));
  },
});


// ================= ROUTES =================

// ✅ GET All Comments
router.get("/", subjectsController.getComments);


// ✅ POST Create Comment (Image Optional)
router.post(
  "/",
  upload.single("image"), // optional automatically
  subjectsController.createComment
);


// ✅ DELETE Comment
router.delete("/:id", subjectsController.deleteComment);


module.exports = router;
