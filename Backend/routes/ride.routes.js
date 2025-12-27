const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middlewares/auth.middlleware");

router.post(
  "/create",
  authMiddleware.authUser,
  body("pickupLocation")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Pickup location is required"),
  body("dropLocation")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Drop location is required"),
  body("vehicleType")
    .isString()
    .isIn(["car", "auto", "motorcycle"])
    .withMessage("Valid vehicle type is required"),
  rideController.createRide
);

router.post(
  "/get-fare",
  authMiddleware.authUser,
  body("pickupLocation")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Pickup location is required"),
  body("dropLocation")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Drop location is required"),
  rideController.getFare
);

module.exports = router;
