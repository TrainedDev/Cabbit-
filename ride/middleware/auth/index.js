require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        if(!token) return res.status(401).json("required token missing!, Unauthorize user access denied");

        const decode = jwt.decode(token, process.env.JWT_SECRET);

        req.user_id = decode.id;

        next();
    } catch (error) {
        res.status(500).json({ msg: "failed to authorize user", Error: error.message });
    }
};

module.exports.captainAuth = async (req, res, next) => {
    try {
        const token = req.cookies.capToken || req.header.authorization.split(" ")[1];

        if(!token) return res.status(401).json("required token missing!, Unauthorize captain access denied");

        const decode = jwt.decode(token, process.env.JWT_SECRET);

        req.captain_id = decode.captain_id;
        
        next();
    } catch (error) {
        res.status(500).json({ msg: "failed to authorize user", Error: error.message });
    }
};