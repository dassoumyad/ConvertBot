const express = require("express");

const router = express.Router();

const aiController = require("../controllers/aiController");

const authMiddleware = require("../middleware/auth_middleware");


// ======================================
// Generate AI Cold Email
// ======================================

router.post(
  "/generate-email",
  authMiddleware,
  aiController.generateEmail
);


// ======================================
// Get Email History
// ======================================

router.get(
  "/history",
  authMiddleware,
  aiController.getEmailHistory
);


// Delete history
router.delete(
  "/history/:id",
  authMiddleware,
  aiController.deleteEmailHistory
);


module.exports = router;