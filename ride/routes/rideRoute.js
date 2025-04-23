const { Router } = require("express");
const { createRide, acceptedRide } = require("../controller/ride");
const { userAuth, captainAuth } = require("../middleware/auth");


const route = Router();

route.post("/create", userAuth, createRide);
route.patch("/status", captainAuth, acceptedRide);

module.exports = { route };