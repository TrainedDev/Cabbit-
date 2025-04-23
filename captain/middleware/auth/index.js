require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.capToken || req.headers.authorization.split(" ")[1];

        if(!token) return res.status(401).json("required token missing!, Unauthorized captain");

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.captainId = decode.captain_id;

        next();
    } catch (error) {
        res.status(500).json({ msg: "failed to authorize captain", Error: error.message });
    }
};

module.exports = { auth };