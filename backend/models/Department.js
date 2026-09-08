const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    HODName: {
      type: String,
      required: true,
    },
    totalFaculty: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
