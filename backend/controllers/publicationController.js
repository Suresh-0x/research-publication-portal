const mongoose = require("mongoose");
const Publication = require("../models/Publication");
const User = require("../models/User");

/* =========================================================
   ADD PUBLICATION
   FACULTY ONLY
========================================================= */

const addPublication = async (req, res) => {
  try {
    const {
      paperTitle,
      publicationType,
      journalConference,
      publicationYear,
      DOI,
    } = req.body;

    if (
      !paperTitle ||
      !publicationType ||
      !journalConference ||
      !publicationYear
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const year = Number(publicationYear);

    if (!Number.isInteger(year)) {
      return res.status(400).json({
        message: "Publication year must be a valid number.",
      });
    }

    const currentYear = new Date().getFullYear();

    if (year < 1900 || year > currentYear) {
      return res.status(400).json({
        message: `Publication year must be between 1900 and ${currentYear}.`,
      });
    }

    const publication = await Publication.create({
      facultyId: req.user.id,
      paperTitle: paperTitle.trim(),
      publicationType,
      journalConference: journalConference.trim(),
      publicationYear: year,
      DOI: DOI ? DOI.trim() : "",
      verificationStatus: "PENDING",
    });

    const populatedPublication =
      await Publication.findById(publication._id)
        .populate(
          "facultyId",
          "name facultyId email role department"
        )
        .populate({
          path: "facultyId",
          populate: {
            path: "department",
            select: "departmentName HODName",
          },
        });

    res.status(201).json({
      message: "Publication added successfully.",
      publication: populatedPublication,
    });
  } catch (error) {
    console.error("Add publication error:", error);

    res.status(500).json({
      message: "Server error while adding publication.",
    });
  }
};


/* =========================================================
   GET ALL PUBLICATIONS
   FACULTY + ADMIN
========================================================= */

const getPublications = async (req, res) => {
  try {
    const {
      search,
      type,
      status,
      year,
      journalConference,
      DOI,
      mine,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    /* Faculty can request only their own publications */

    if (mine === "true") {
      filter.facultyId = req.user.id;
    }

    /* Search */

    if (search && search.trim()) {
      filter.$or = [
        {
          paperTitle: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          journalConference: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          DOI: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    /* Publication type */

    if (type) {
      filter.publicationType = type;
    }

    /* Verification status */

    if (status) {
      filter.verificationStatus =
        status.toUpperCase();
    }

    /* Year */

    if (year) {
      const publicationYear = Number(year);

      if (!Number.isNaN(publicationYear)) {
        filter.publicationYear =
          publicationYear;
      }
    }

    /* Journal / Conference */

    if (
      journalConference &&
      journalConference.trim()
    ) {
      filter.journalConference = {
        $regex: journalConference.trim(),
        $options: "i",
      };
    }

    /* DOI */

    if (DOI && DOI.trim()) {
      filter.DOI = {
        $regex: DOI.trim(),
        $options: "i",
      };
    }

    const pageNumber =
      Math.max(Number(page), 1);

    const limitNumber =
      Math.min(
        Math.max(Number(limit), 1),
        100
      );

    const skip =
      (pageNumber - 1) * limitNumber;

    const [publications, total] =
      await Promise.all([
        Publication.find(filter)
          .populate(
            "facultyId",
            "name facultyId email role department"
          )
          .populate({
            path: "facultyId",
            populate: {
              path: "department",
              select:
                "departmentName HODName",
            },
          })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNumber)
          .lean(),

        Publication.countDocuments(filter),
      ]);

    res.status(200).json({
      publications,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages:
          Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error(
      "Get publications error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching publications.",
    });
  }
};


/* =========================================================
   GET SINGLE PUBLICATION
========================================================= */

const getPublicationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid publication ID.",
      });
    }

    const publication =
      await Publication.findById(id)
        .populate(
          "facultyId",
          "name facultyId email role department"
        )
        .populate({
          path: "facultyId",
          populate: {
            path: "department",
            select:
              "departmentName HODName",
          },
        });

    if (!publication) {
      return res.status(404).json({
        message: "Publication not found.",
      });
    }

    res.status(200).json(publication);
  } catch (error) {
    console.error(
      "Get publication error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching publication.",
    });
  }
};


/* =========================================================
   UPDATE PUBLICATION
   FACULTY OWNER + ADMIN
========================================================= */

const updatePublication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid publication ID.",
      });
    }

    const publication =
      await Publication.findById(id);

    if (!publication) {
      return res.status(404).json({
        message: "Publication not found.",
      });
    }

    /* Faculty can edit only their own publication */

    if (
      req.user.role === "faculty" &&
      publication.facultyId.toString() !==
        req.user.id
    ) {
      return res.status(403).json({
        message:
          "You can update only your own publications.",
      });
    }

    const {
      paperTitle,
      publicationType,
      journalConference,
      publicationYear,
      DOI,
    } = req.body;

    if (
      !paperTitle ||
      !publicationType ||
      !journalConference ||
      !publicationYear
    ) {
      return res.status(400).json({
        message:
          "Please provide all required publication fields.",
      });
    }

    const year = Number(publicationYear);

    if (
      !Number.isInteger(year) ||
      year < 1900 ||
      year > new Date().getFullYear()
    ) {
      return res.status(400).json({
        message: "Invalid publication year.",
      });
    }

    publication.paperTitle =
      paperTitle.trim();

    publication.publicationType =
      publicationType;

    publication.journalConference =
      journalConference.trim();

    publication.publicationYear =
      year;

    publication.DOI =
      DOI ? DOI.trim() : "";

    /*
      Do NOT allow normal update to change
      verificationStatus.
    */

    await publication.save();

    const updatedPublication =
      await Publication.findById(id)
        .populate(
          "facultyId",
          "name facultyId email role department"
        )
        .populate({
          path: "facultyId",
          populate: {
            path: "department",
            select:
              "departmentName HODName",
          },
        });

    res.status(200).json({
      message:
        "Publication updated successfully.",
      publication: updatedPublication,
    });
  } catch (error) {
    console.error(
      "Update publication error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while updating publication.",
    });
  }
};


/* =========================================================
   VERIFY / REJECT PUBLICATION
   ADMIN ONLY
========================================================= */

const verifyPublication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid publication ID.",
      });
    }

    if (
      !["VERIFIED", "REJECTED"].includes(
        status
      )
    ) {
      return res.status(400).json({
        message:
          "Status must be VERIFIED or REJECTED.",
      });
    }

    const publication =
      await Publication.findById(id);

    if (!publication) {
      return res.status(404).json({
        message: "Publication not found.",
      });
    }

    publication.verificationStatus =
      status;

    await publication.save();

    const updatedPublication =
      await Publication.findById(id)
        .populate(
          "facultyId",
          "name facultyId email role department"
        )
        .populate({
          path: "facultyId",
          populate: {
            path: "department",
            select:
              "departmentName HODName",
          },
        });

    res.status(200).json({
      message:
        `Publication ${status.toLowerCase()} successfully.`,
      publication: updatedPublication,
    });
  } catch (error) {
    console.error(
      "Verify publication error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while updating verification status.",
    });
  }
};


/* =========================================================
   DELETE PUBLICATION
   ADMIN ONLY
========================================================= */

const deletePublication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid publication ID.",
      });
    }

    const publication =
      await Publication.findByIdAndDelete(id);

    if (!publication) {
      return res.status(404).json({
        message: "Publication not found.",
      });
    }

    res.status(200).json({
      message:
        "Publication deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete publication error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while deleting publication.",
    });
  }
};


/* =========================================================
   PUBLICATION STATISTICS
   ADMIN + FACULTY
========================================================= */

const getPublicationStats = async (req, res) => {
  try {
    const filter = {};

    if (req.query.mine === "true") {
      filter.facultyId = req.user.id;
    }

    const [
      total,
      pending,
      verified,
      rejected,
    ] = await Promise.all([
      Publication.countDocuments(filter),

      Publication.countDocuments({
        ...filter,
        verificationStatus: "PENDING",
      }),

      Publication.countDocuments({
        ...filter,
        verificationStatus: "VERIFIED",
      }),

      Publication.countDocuments({
        ...filter,
        verificationStatus: "REJECTED",
      }),
    ]);

    res.status(200).json({
      total,
      pending,
      verified,
      rejected,
    });
  } catch (error) {
    console.error(
      "Publication stats error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while fetching statistics.",
    });
  }
};


/* =========================================================
   EXPORT
========================================================= */

module.exports = {
  addPublication,
  getPublications,
  getPublicationById,
  updatePublication,
  verifyPublication,
  deletePublication,
  getPublicationStats,
};