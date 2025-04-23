const { Rides: rideModel } = require("../models");
const { publishToQueue } = require("../service/rabbit");


const createRide = async (req, res) => {
    try {
        const userId = req.user_id;
        const { pickUp, dropOf } = req.body;
console.log(userId);

        if (!userId) return res.status(400).json("user id missing!");
        if (!pickUp || !dropOf) return res.status(400).json("required details not found");

        const newRide = await rideModel.create({ pickUp, dropOf, userId });

        publishToQueue("new-ride", JSON.stringify(newRide));

        res.status(200).json({ msg: "new user ride successfully created" });

    } catch (error) {
        res.status(500).json({ msg: "failed to create user ride", Error: error.message })
    }
};

const acceptedRide = async (req, res) => {
    try {
        const captainId = req.captain_id;
        const { rideId } = req.query;

        if (!captainId) return res.status(400).json("captain id missing!");
        if (!rideId) return res.status(400).json("required ride details are missing");

        await rideModel.update({ captainId, status: "accepted" }, { where: { id: rideId } });

        const rideData = await rideModel.findOne({ where: { id: rideId } });
        publishToQueue('accepted-ride', JSON.stringify(rideData));

        res.status(200).json({ msg: "ride successfully updated" });

    } catch (error) {
        res.status(500).json({ msg: "failed to update ride status", Error: error.message })
    }
};

module.exports = { createRide, acceptedRide };