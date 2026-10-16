const mongoose = require("mongoose");

const Department = require("../models/Department");
const User = require("../models/User");

/* =========================================================
   GET ALL DEPARTMENTS
========================================================= */

const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .sort({ departmentName: 1 })
      .lean();

    res.status(200).json(departments);
  } catch (error) {
    console.error("Get departments error:", error);

    res.status(500).json({
      message:
        "Server error while fetching departments.",
    });
  }
};

/* =========================================================
   GET SINGLE DEPARTMENT
========================================================= */

const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid department ID.",
      });
    }

    const department =
      await Department.findById(id);

    if (!department) {
      return res.status(404).json({
        message: "Department not found.",
      });
    }

    res.status(200).json(department);
  } catch (error) {
    console.error(
      "Get department error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching department.",
    });
  }
};

/* =========================================================
   CREATE DEPARTMENT
   ADMIN ONLY
========================================================= */

const createDepartment = async (req, res) => {
  try {
    const {
      departmentName,
      HODName,
    } = req.body;

    if (!departmentName || !HODName) {
      return res.status(400).json({
        message:
          "Department name and HOD name are required.",
      });
    }

    const cleanDepartmentName =
      departmentName.trim();

    const cleanHODName =
      HODName.trim();

    const existingDepartment =
      await Department.findOne({
        departmentName:
          cleanDepartmentName,
      });

    if (existingDepartment) {
      return res.status(400).json({
        message:
          "Department already exists.",
      });
    }

    const department =
      await Department.create({
        departmentName:
          cleanDepartmentName,

        HODName:
          cleanHODName,

        totalFaculty: 0,
      });

    res.status(201).json({
      message:
        "Department created successfully.",
      department,
    });
  } catch (error) {
    console.error(
      "Create department error:",
      error
    );

    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "Department already exists.",
      });
    }

    res.status(500).json({
      message:
        "Server error while creating department.",
    });
  }
};

/* =========================================================
   UPDATE DEPARTMENT
   ADMIN ONLY
========================================================= */

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      departmentName,
      HODName,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid department ID.",
      });
    }

    if (!departmentName || !HODName) {
      return res.status(400).json({
        message:
          "Department name and HOD name are required.",
      });
    }

    const cleanDepartmentName =
      departmentName.trim();

    const cleanHODName =
      HODName.trim();

    const duplicate =
      await Department.findOne({
        departmentName:
          cleanDepartmentName,
        _id: { $ne: id },
      });

    if (duplicate) {
      return res.status(400).json({
        message:
          "Another department already uses this name.",
      });
    }

    const department =
      await Department.findByIdAndUpdate(
        id,
        {
          departmentName:
            cleanDepartmentName,
          HODName: cleanHODName,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!department) {
      return res.status(404).json({
        message:
          "Department not found.",
      });
    }

    res.status(200).json({
      message:
        "Department updated successfully.",
      department,
    });
  } catch (error) {
    console.error(
      "Update department error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while updating department.",
    });
  }
};

/* =========================================================
   DELETE DEPARTMENT
   ADMIN ONLY
========================================================= */

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid department ID.",
      });
    }

    /* Check whether faculty are assigned */

    const facultyCount =
      await User.countDocuments({
        department: id,
        role: "faculty",
      });

    if (facultyCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete this department because faculty members are assigned to it.",
      });
    }

    const department =
      await Department.findByIdAndDelete(id);

    if (!department) {
      return res.status(404).json({
        message:
          "Department not found.",
      });
    }

    res.status(200).json({
      message:
        "Department deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete department error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while deleting department.",
    });
  }
};

/* =========================================================
   EXPORT
========================================================= */

module.exports = {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};