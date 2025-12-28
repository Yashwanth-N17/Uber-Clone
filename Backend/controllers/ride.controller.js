const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const rideModel = require("../models/ride.model");
const mapsService = require("../services/maps.service");
const { sendMessageToSocketId } = require("../socket");

module.exports.createRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { pickupLocation, dropLocation, vehicleType } = req.body;
  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickupLocation,
      dropLocation,
      vehicleType,
    });
    const pickupCoorinates = await mapsService.getAddressCoordinates(
      pickupLocation
    );
    const ltd = pickupCoorinates.latitude;
    const lan = pickupCoorinates.longitude;
    const captainsInRadius = await mapsService.getCaptainsInTheRadius(
      ltd,
      lan,
      5
    );

    const rideWithUser = await rideModel
      .findOne({ _id: ride._id })
      .populate("user");
    captainsInRadius.forEach((captain) => {
      if (captain.socketId) {
        sendMessageToSocketId(captain.socketId, {
          event: "new-ride",
          data: rideWithUser,
        });
      }
    });

    res.status(201).json(ride);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.getFare = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { pickupLocation, dropLocation } = req.body;
  try {
    const fare = await rideService.getFare(pickupLocation, dropLocation);

    res.status(200).json(fare);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.confirmRide = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { rideId } = req.body;
  try {
    const ride = await rideService.confirmRide({
      captain: req.captain,
      rideId,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });

    res.status(200).json(ride);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.startRide = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { rideId, otp } = req.query;
  try {
    const ride = await rideService.startRide({
      captain: req.captain,
      rideId,
      otp,
    });

    // Emit ride-started event to the user
    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });

    res.status(200).json(ride);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports.endRide = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { rideId } = req.body;
  try {
    const ride = await rideService.endRide({
      captain: req.captain,
      rideId,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });
    
    res.status(200).json(ride);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};