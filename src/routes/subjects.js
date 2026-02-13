const router = require("express").Router();

// ✅ Import the subjects controller
const subjectsController = require("../controllers/subjectsController");

// ✅ Routes
router.post("/", subjectsController.createSubject);        // Create a subject + MCQs
router.get("/", subjectsController.getAllSubjects);        // Get all subjects with MCQs
router.get("/:id", subjectsController.getSubjectById);     // Get subject by ID with MCQs
router.delete("/:id", subjectsController.deleteSubject);   // Delete subject (MCQs deleted via CASCADE)

module.exports = router;
