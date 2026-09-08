const express = require("express");
const Department = require("../models/Department");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route   GET /departments
// @desc    Get all departments (any logged-in user)
router.get("/", protect, async (req, res) => {
  try {
    const departments = await Department.find().sort({ departmentName: 1 });
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /departments
// @desc    Admin only - create a department
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const { departmentName, HODName, totalFaculty } = req.body;
    const department = await Department.create({ departmentName, HODName, totalFaculty });
    res.status(201).json({ message: "Department created", department });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /departments/:id
// @desc    Admin only - update a department
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department updated", department });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /departments/:id
// @desc    Admin only - delete a department
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
