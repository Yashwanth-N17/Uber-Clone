const mapService = require("../services/maps.service");
const { validationResult }= require("express-validator")

module.exports.getCoordinates = async(req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const { address } = req.query;
    try {
        const coordinates = await mapService.getAddressCoordinates(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({message : "Coordinates not found"});

    }
}

module.exports.getDistanceAndTime = async(req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }  
    const { origin, destination } = req.query;
    try {
        const distanceTime = await mapService.getDistanceAndTime(origin, destination);
        res.status(200).json(distanceTime);
    } catch (error) {
        res.status(404).json({message : "Distance and time not found"});
    }
}

module.exports.getAutoCompleteSuggestions = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const { query, lat, lng } = req.query;

    try {
        const suggestions = await mapService.getAutoCompleteSuggestions(query, lat, lng);
        res.status(200).json(suggestions);
    } catch (error) {
        res.status(404).json({message : "Suggestions not found"});
    }
}
