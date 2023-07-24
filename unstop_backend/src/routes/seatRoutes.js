const express = require("express");
const errorHandler = require("../middleware/errorHandle");

const {
  getAllSeats,
  bookSeats,
  resetSeats,
  createSeats,
} = require("../controller/seatController");
const router = express.Router();

router.get("/", getAllSeats);
router.get("/seats", createSeats);
router.patch("/seats", errorHandler, bookSeats);
router.patch("/reset", resetSeats);

module.exports = router;
