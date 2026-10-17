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

    return res.status(200).json(departments);
  } catch (error) {
    console.error("Get departments error:", error);

    return res.status(500).json({
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

    return res.status(200).json(department);
  } catch (error) {
    console.error(
      "Get department error:",
      error
    );

    return res.status(500).json({
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
      totalFaculty,
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

    const facultyCount =
      totalFaculty === undefined ||
      totalFaculty === ""
        ? 0
        : Number(totalFaculty);

    if (
      Number.isNaN(facultyCount) ||
      facultyCount < 0
    ) {
      return res.status(400).json({
        message:
          "Total Faculty must be a valid non-negative number.",
      });
    }

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

        totalFaculty:
          facultyCount,
      });

    return res.status(201).json({
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

    return res.status(500).json({
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
      totalFaculty,
    } = req.body;

    /* -----------------------------------------
       Validate ID
    ----------------------------------------- */

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid department ID.",
      });
    }

    /* -----------------------------------------
       Validate required fields
    ----------------------------------------- */

    if (!departmentName || !HODName) {
      return res.status(400).json({
        message:
          "Department name and HOD name are required.",
      });
    }

    /* -----------------------------------------
       Clean text values
    ----------------------------------------- */

    const cleanDepartmentName =
      departmentName.trim();

    const cleanHODName =
      HODName.trim();

    /* -----------------------------------------
       Convert totalFaculty to number
    ----------------------------------------- */

    const facultyCount =
      totalFaculty === undefined ||
      totalFaculty === ""
        ? 0
        : Number(totalFaculty);

    if (
      Number.isNaN(facultyCount) ||
      facultyCount < 0
    ) {
      return res.status(400).json({
        message:
          "Total Faculty must be a valid non-negative number.",
      });
    }

    /* -----------------------------------------
       Check duplicate department name
    ----------------------------------------- */

    const duplicate =
      await Department.findOne({
        departmentName:
          cleanDepartmentName,

        _id: {
          $ne: id,
        },
      });

    if (duplicate) {
      return res.status(400).json({
        message:
          "Another department already uses this name.",
      });
    }

    /* -----------------------------------------
       UPDATE DEPARTMENT
    ----------------------------------------- */

    const department =
      await Department.findByIdAndUpdate(
        id,
        {
          departmentName:
            cleanDepartmentName,

          HODName:
            cleanHODName,

          totalFaculty:
            facultyCount,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    /* -----------------------------------------
       Department not found
    ----------------------------------------- */

    if (!department) {
      return res.status(404).json({
        message:
          "Department not found.",
      });
    }

    /* -----------------------------------------
       SUCCESS
    ----------------------------------------- */

    return res.status(200).json({
      message:
        "Department updated successfully.",

      department,
    });
  } catch (error) {
    console.error(
      "Update department error:",
      error
    );

    return res.status(500).json({
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

    /* -----------------------------------------
       Check whether faculty are assigned
    ----------------------------------------- */

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

    /* -----------------------------------------
       Delete department
    ----------------------------------------- */

    const department =
      await Department.findByIdAndDelete(id);

    if (!department) {
      return res.status(404).json({
        message:
          "Department not found.",
      });
    }

    return res.status(200).json({
      message:
        "Department deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete department error:",
      error
    );

    return res.status(500).json({
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