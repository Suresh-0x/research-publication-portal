const express = require("express");
const Publication = require("../models/Publication");
const { protect, isAdmin, isFaculty } = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /publications
// @desc    Faculty adds a new publication
router.post("/", protect, isFaculty, async (req, res) => {
  try {
    const { paperTitle, publicationType, journalConference, publicationYear, DOI } = req.body;

    const publication = await Publication.create({
      facultyId: req.user.id,
      paperTitle,
      publicationType,
      journalConference,
      publicationYear,
      DOI,
      verificationStatus: "pending",
    });

    res.status(201).json({ message: "Publication added successfully", publication });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /publications
// @desc    Get all publications (supports search/filter via query params)
//          e.g. /publications?search=machine+learning&year=2024&status=verified
//          Faculty see their own via /publications?mine=true
router.get("/", protect, async (req, res) => {
  try {
    const { search, year, status, mine } = req.query;
    const filter = {};

    if (mine === "true") {
      filter.facultyId = req.user.id;
    }
    if (search) {
      filter.paperTitle = { $regex: search, $options: "i" };
    }
    if (year) {
      filter.publicationYear = year;
    }
    if (status) {
      filter.verificationStatus = status;
    }

    const publications = await Publication.find(filter)
      .populate("facultyId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(publications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /publications/:id
// @desc    Faculty updates own publication OR admin verifies/edits any publication
router.put("/:id", protect, async (req, res) => {
  try {
    const publication = await Publication.findById(req.params.id);

    if (!publication) {
      return res.status(404).json({ message: "Publication not found" });
    }

    const isOwner = publication.facultyId.toString() === req.user.id;
    const isAdminUser = req.user.role === "admin";

    if (!isOwner && !isAdminUser) {
      return res.status(403).json({ message: "Not authorized to update this publication" });
    }

    // Only admins can change verification status
    if (req.body.verificationStatus && !isAdminUser) {
      delete req.body.verificationStatus;
    }

    const updated = await Publication.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: "Publication updated", publication: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /publications/:id
// @desc    Admin only - delete a publication
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const publication = await Publication.findByIdAndDelete(req.params.id);

    if (!publication) {
      return res.status(404).json({ message: "Publication not found" });
    }

    res.status(200).json({ message: "Publication deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
