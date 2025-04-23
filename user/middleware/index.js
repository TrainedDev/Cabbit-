require("dotenv").config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {

        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        if (!token) return res.status(401).json("token missing! Access Denied");

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decode.id;

        next();
    } catch (error) {
        res.status(500).json({ msg: "failed to authorize user", Error: error.message })
    }
};

module.exports = { auth };