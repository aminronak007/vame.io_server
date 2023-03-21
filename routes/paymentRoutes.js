const express = require("express");
const router = express.Router();

const {
  cardTransactions,
  allTransactions,
  paypalTransactions,
  storeEmployerPaypalDetails,
  storeFreelancerPaypalDetails,
} = require("../controllers/paymentController");

router.post("/api/card/transactions", cardTransactions);
router.get("/api/all-transactions", allTransactions);
router.post("/api/paypal", paypalTransactions);

router.post("/api/employer/paypal/store/details", storeEmployerPaypalDetails);
router.post(
  "/api/freelancer/paypal/store/details",
  storeFreelancerPaypalDetails
);

module.exports = router;
