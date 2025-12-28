const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
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

router.post(
  "/confirm",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Valid ride ID is required"),
  rideController.confirmRide
);

router.get(
  "/start-ride",
  authMiddleware.authCaptain,
  query("rideId").isMongoId().withMessage("Valid ride ID is required"),
  query("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("Valid OTP is required"),
  rideController.startRide
);


router.post(
  "/end-ride",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Valid ride ID is required"),
  rideController.endRide
);
module.exports = router;
