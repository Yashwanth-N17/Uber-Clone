const axios = require("axios");
const captainModel = require("../models/captain.model");
 
module.exports.getAddressCoordinates = async (address) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const data = response.data;

    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } else {
      throw new Error("Coordinates not found for the given address.");
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
};

module.exports.getDistanceAndTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and Destination are required");
  }

  const originCoords = await module.exports.getAddressCoordinates(origin);
  const destinationCoords = await module.exports.getAddressCoordinates(
    destination
  );

  try {
    const response = await axios.get(
      `http://router.project-osrm.org/route/v1/driving/${originCoords.longitude},${originCoords.latitude};${destinationCoords.longitude},${destinationCoords.latitude}?overview=false`
    );
    const data = response.data;

    if (data && data.routes && data.routes.length > 0) {
      const route = data.routes[0];

      const distanceInKm = route.distance / 1000;
      const durationInMinutes = Math.round(route.duration / 60);

      return {
        distance: {
          value: route.distance,
          text: `${distanceInKm.toFixed(2)} km`,
        },
        duration: {
          value: route.duration,
          text: `${Math.floor(durationInMinutes / 60)} h ${
            durationInMinutes % 60
          } min`,
        },
        status: "OK",
      };
    } else {
      throw new Error("Route not found between the given coordinates.");
    }
  } catch (error) {
    console.error("Error fetching distance and time:", error);
    throw error;
  }
};

module.exports.getAutoCompleteSuggestions = async (input, lat, lng) => {
  if (!input) {
    throw new Error("Input is required");
  }

  let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    input
  )}&addressdetails=1&limit=2`;

  if (lat && lng) {
    const minLat = parseFloat(lat) - 1;
    const maxLat = parseFloat(lat) + 1;
    const minLon = parseFloat(lng) - 1;
    const maxLon = parseFloat(lng) + 1;
    url += `&viewbox=${minLon},${maxLat},${maxLon},${minLat}`;
  }

  try {
    const response = await axios.get(url);
    const data = response.data;
    if (data && data.length > 0) {
      return data.map((item) => ({
        description: item.display_name,
        location: { lat: item.lat, lng: item.lon }
      }));
    } else {
      throw new Error("No suggestions found for the given input.");
    }
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    throw error;
  }
};

function getDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}


module.exports.getCaptainsInTheRadius = async (lat, lng, radiusInKm) => {
  if (!radiusInKm) {
    throw new Error("Radius is required");
  }

  // Get only captains with valid location
  const captains = await captainModel.find({
    "location.ltd": { $ne: null },
    "location.lng": { $ne: null },
  });

  const nearbyCaptains = captains.filter((captain) => {
    const distance = getDistanceInKm(
      lat,
      lng,
      captain.location.ltd,
      captain.location.lng
    );

    return distance <= radiusInKm;
  });

  return nearbyCaptains;
};