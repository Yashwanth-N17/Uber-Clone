const rideModel = require("../models/ride.model");
const mapService = require("../services/maps.service");
const crypto = require("crypto");

const vehiclePricing = {
  car: {
    baseFare: 60,
    perKm: 12,
    perMin: 1,
    currency: "INR",
  },
  auto: {
    baseFare: 35,
    perKm: 9,
    perMin: 0.8,
    currency: "INR",
  },
  motorcycle: {
    baseFare: 25,
    perKm: 7,
    perMin: 0.6,
    currency: "INR",
  },
};

async function getFare(pickupLocation, dropLocation) {
  if (!pickupLocation || !dropLocation) {
    throw new Error(
      "Pickup and Drop locations are required to calculate fare."
    );
  }

  const distanceTime = await mapService.getDistanceAndTime(
    pickupLocation,
    dropLocation
  );
  const { distance, duration } = distanceTime;

  const distanceKm = Math.max(distance.value / 1000, 0);
  const durationMin = Math.max(duration.value / 60, 0);
  const fares = {};
  Object.keys(vehiclePricing).forEach((vehicleType) => {
    const rate = vehiclePricing[vehicleType];
    const fare =
      rate.baseFare + distanceKm * rate.perKm + durationMin * rate.perMin;
    fares[vehicleType] = {
      currency: rate.currency,
      fare: Number(fare.toFixed(2)),
      distanceKm: Number(distanceKm.toFixed(2)),
      durationMin: Number(durationMin.toFixed(2)),
    };
  });

  return fares;
}

module.exports.getFare = getFare;

function getOtp(num = 4) {
  const otp = crypto
    .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
    .toString();
  return otp;
}

module.exports.getFare = getFare;

module.exports.getOtp = getOtp;

module.exports.createRide = async ({
  user,
  pickupLocation,
  dropLocation,
  vehicleType,
}) => {
  if (!user || !pickupLocation || !dropLocation || !vehicleType) {
    throw new Error("All fields are required");
  }

  const fares = await getFare(pickupLocation, dropLocation);

  if (!fares[vehicleType]) {
    throw new Error("Invalid vehicle type selected.");
  }
  const ride = await rideModel.create({
    user,
    pickupLocation,
    dropLocation,
    fare: fares[vehicleType].fare,
    status: "pending",
    otp: getOtp(6),
  });

  return ride;
};

module.exports.confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}
