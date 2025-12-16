const captainModel = require("../models/captain.model");
const captainSerivce = require("../services/captain.service");
const { validationResult } = require("express-validator");

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, password, vehicle } = req.body;
  const isCaptianExist = await captainModel.findOne({ email });
  if (isCaptianExist) {
    return res.status(400).json({ message: "Captain already exist" });
  }
  const hashedPassword = await captainModel.hashPassword(password);

  const captian = await captainSerivce.createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
  });
  const token = captian.generateAuthToken();
  res.status(201).json({ captian, token });
};
