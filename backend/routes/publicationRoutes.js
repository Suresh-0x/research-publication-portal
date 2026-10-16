const express = require("express");

const {
  addPublication,
  getPublications,
  getPublicationById,
  updatePublication,
  verifyPublication,
  deletePublication,
  getPublicationStats,
} = require("../controllers/publicationController");

const {
  protect,
  isAdmin,
  isFaculty,
} = require("../middleware/authMiddleware");

const router = express.Router();

/*
=========================================================
PUBLICATION ROUTES
=========================================================
*/

/*
---------------------------------------------------------
GET PUBLICATION STATISTICS
Faculty + Admin
---------------------------------------------------------
IMPORTANT:
Keep /stats before /:id
---------------------------------------------------------
*/

router.get(
  "/stats",
  protect,
  getPublicationStats
);


/*
---------------------------------------------------------
GET ALL PUBLICATIONS
Faculty + Admin
---------------------------------------------------------
*/

router.get(
  "/",
  protect,
  getPublications
);


/*
---------------------------------------------------------
ADD PUBLICATION
Faculty only
---------------------------------------------------------
*/

router.post(
  "/",
  protect,
  isFaculty,
  addPublication
);


/*
---------------------------------------------------------
GET SINGLE PUBLICATION
Faculty + Admin
---------------------------------------------------------
*/

router.get(
  "/:id",
  protect,
  getPublicationById
);


/*
---------------------------------------------------------
UPDATE PUBLICATION
Faculty: own publication
Admin: any publication

Verification status cannot be changed here.
---------------------------------------------------------
*/

router.put(
  "/:id",
  protect,
  updatePublication
);


/*
---------------------------------------------------------
VERIFY / REJECT PUBLICATION
Admin only
---------------------------------------------------------
*/

router.put(
  "/:id/verify",
  protect,
  isAdmin,
  verifyPublication
);


/*
---------------------------------------------------------
DELETE PUBLICATION
Admin only
---------------------------------------------------------
*/

router.delete(
  "/:id",
  protect,
  isAdmin,
  deletePublication
);


module.exports = router;