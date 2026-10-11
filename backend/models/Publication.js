const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paperTitle: {
      type: String,
      required: true,
      trim: true,
    },
    publicationType: {
      type: String,
      enum: ["Journal", "Conference", "Book Chapter", "Patent"],
      required: true,
    },
    journalConference: {
      type: String,
      required: true,
    },
    publicationYear: {
      type: Number,
      required: true,
    },
    DOI: {
      type: String,
      trim: true,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Performance indexes for fast querying, filtering, and tab sorting
publicationSchema.index({ facultyId: 1 });
publicationSchema.index({ verificationStatus: 1 });
publicationSchema.index({ createdAt: -1 });
publicationSchema.index({ facultyId: 1, verificationStatus: 1 });
publicationSchema.index({ publicationYear: -1 });

module.exports = mongoose.model("Publication", publicationSchema);
