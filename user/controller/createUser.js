require("dotenv").config();
const { uber_users: usersModel } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userCookie, storeOauthUser } = require("../services/userService");
const { default: axios } = require("axios");
const eventEmitter = require("events");
const { subscribeToQueue } = require("../services/rabbit");
const rideEmitter = new eventEmitter();

const register = async (req, res) => {
    try {
        const { username, password, email, phoneNumber } = req.body;

        if (!username || !password || !email || !phoneNumber) return res.status(400).json("required details not found");

        // console.log(require("../models"));


        const existUser = await usersModel.findOne({ where: { email } });

        if (existUser) return res.status(400).json("user already exist with this email");

        const saltPassword = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, saltPassword);

        const user = await usersModel.create({ ...req.body, password: hashPassword });
        const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, { expiresIn: "5h" });

        const { password: _, ...userData } = user.get({ plain: true });

        userCookie(res, token);

        res.status(201).json({ msg: "user successfully created", user: userData });
    } catch (error) {
        res.status(500).json({ msg: "failed to register user", Error: error.message })
    }
};

const login = async (req, res) => {
    try {
        const { password, email } = req.body;

        if (!password || !email) return res.status(400).json("required details not found");

        const existUser = await usersModel.findOne({ where: { email } });

        if (!existUser) return res.status(400).json("invalid credentials");

        const checkPassword = await bcrypt.compare(password, existUser.password);

        if (!checkPassword) return res.status(400).json("invalid credentials");

        const token = jwt.sign({ id: existUser.id }, process.env.JWT_SECRET, { expiresIn: "5h" });

        const { password: userPassword, ...userData } = existUser.get({ plain: true })

        userCookie(res, token);

        res.status(200).json({ msg: "user successfully logged In", user: userData });

    } catch (error) {
        res.status(500).json({ msg: "failed to logged in user", Error: error.message });
    }
};

const githubLogin = async (req, res) => {
    try {
        const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user,repo,security_events`;

        res.redirect(url);
    } catch (error) {
        res.status(500).json({ msg: "failed to login with github", Error: error.message })
    }
};

const fetchGithubAccessToken = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) return res.status(400).json("required code for github access token not found");

        const tokenResponse = await axios.post("https://github.com/login/oauth/access_token",
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },

            { headers: { "Accept": "application/json" } }

        );

        const accessToken = tokenResponse.data.access_token;

        const checkUser = await storeOauthUser(accessToken, "github");

        if (!checkUser) return res.status(400).json("failed to store oauth user")

        const token = jwt.sign({ user_id: checkUser.id }, process.env.JWT_SECRET, { expiresIn: "5h" });

        userCookie(res, token);

        res.redirect(process.env.FRONTEND_URL);
    } catch (error) {
        res.status(500).json({ msg: "failed to fetch user github access token", Error: error.message })
    }
};

const googleLogin = async (req, res) => {
    try {
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_url=${process.env.BACKEND_URL}/auth/google/calback&response_type=code&scope=profile email`;

        res.redirect(url);
    } catch (error) {
        res.status(500).json({ msg: 'failed to login with google', Error: error.message });
    }
};

const fetchGoogleAccessToken = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) return res.status(400).json("required google code is missing");

        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token",
            {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                code,
                grant_type: "authorization_code",
                redirect_url: process.env.BACKEND_URL,
            },

            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }

        );

        const accessToken = tokenResponse.data.access_token;

        const checkUser = await storeOauthUser(accessToken, "google");

        if (!checkUser) return res.status(400).json("failed to store oauth user")

        const token = jwt.sign({ user_id: checkUser.id }, process.env.JWT_SECRET, { expiresIn: "5h" });

        userCookie(res, token);

        res.redirect(process.env.FRONTEND_URL);
    } catch (error) {
        res.status(500).json({ msg: "failed to fetch google access token", Error: error.message })
    }
};

const userProfile = async (req, res) => {
    try {

        const id = req.userId;

        if (!id) return res.status(400).json("required details not found");

        const fetchUser = await usersModel.findOne({ where: { id } });

        if (!fetchUser) return res.status(404).json("user not found");

        const { password, ...userData } = fetchUser.get({ plain: true });

        res.status(200).json({ msg: "user profile successfully fetched", userData });
    } catch (error) {
        res.status(500).json({ msg: "failed to fetch user profile", Error: error.message })
    }
};

const acceptedRide = async (req, res) => {
    try {
        rideEmitter.once("accepted-ride", (data) => {
            res.send(data);
        });

        setTimeout(() => {
            res.status(204).send();
        }, 30000);

        subscribeToQueue("accepted-ride", (msg) => {
            const data = JSON.parse(msg);

            rideEmitter.emit("accepted-ride", data);
        })
    } catch (error) {
        res.status(500).json({ msg: "failed to fetch accepted ride", Error: error.message });
    }
}

module.exports = { register, login, githubLogin, githubLogin, fetchGithubAccessToken, googleLogin, fetchGoogleAccessToken, userProfile, acceptedRide };