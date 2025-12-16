const captainModel = require("../models/captain.model");
const captainSerivce = require("../services/captain.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blackListToken.model");
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

module.exports.loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const captain = await captainModel.findOne({ email }).select("+password");
  if (!captain) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const isPasswordValid = await captain.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = captain.generateAuthToken();
  res.status(200).json({ captain, token });
};

module.exports.getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};

module.exports.logoutCaptain = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  await blackListTokenModel.create({ token: token });
  res.clearCookie('token');
  res.status(200).json({ message: "Logged out successfully" });
};
