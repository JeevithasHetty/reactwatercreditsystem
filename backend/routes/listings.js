const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { createListing, getListings } = require("../controllers/listingController");

router.get("/", getListings);
router.post("/", auth, createListing); // only logged in users can create

module.exports = router;
