const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");

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
