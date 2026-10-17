const express = require("express");

const {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const {
  protect,
  isAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
=========================================================
DEPARTMENT ROUTES
=========================================================
*/

// Get all departments
// PUBLIC - required during faculty registration
router.get("/", getDepartments);

// Get single department
// PUBLIC
router.get("/:id", getDepartmentById);

// Create department
// Admin only
router.post(
  "/",
  protect,
  isAdmin,
  createDepartment
);

// Update department
// Admin only
router.put(
  "/:id",
  protect,
  isAdmin,
  updateDepartment
);

// Delete department
// Admin only
router.delete(
  "/:id",
  protect,
  isAdmin,
  deleteDepartment
);

module.exports = router;