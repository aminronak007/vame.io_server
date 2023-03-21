const express = require("express");
const router = express.Router();
const { addOffers } = require("../controllers/offersController");

router.post("/api/add/offers", addOffers);

module.exports = router;
