const { Captains: captainModel, Verifications: verificationModel } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { cloudinaryUpload, captainCookies } = require("../service/captainServices");
const { subscribeToQueue } = require("../service/rabbit");
require("dotenv").config();

const register = async (req, res) => {
    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) return res.status(400).json({ msg: "required details not found!" });

        const existCaptain = await captainModel.findOne({ where: { email } });

        if (existCaptain) return res.status(400).json("captain already exists with this email, try again");

        const saltPassword = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, saltPassword);

        const captainData = await captainModel.create({ ...req.body, password: hashPassword });

        const token = jwt.sign({ captain_id: captainData.id }, process.env.JWT_SECRET);

        captainCookies(res, token);

        res.status(201).json({ msg: "captain successfully registered" });

    } catch (error) {
        res.status(500).json({ msg: "failed to register", Error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json("required details not found!");

        const existCaptain = await captainModel.findOne({ where: { email } });

        if (!existCaptain) return res.status(400).json("invalid credentials");

        const checkPassword = await bcrypt.compare(password, existCaptain.password);

        if (!checkPassword) return res.status(400).json("invalid credentials")

        const token = jwt.sign({ captain_id: existCaptain.id }, process.env.JWT_SECRET);

        captainCookies(res, token);

        res.status(200).json({ msg: "captain successfully logged in" });
    } catch (error) {
        res.status(500).json({ msg: "captain failed to login", Error: error.message })
    }
};

// const githubLogin = (req, res) => {
//     try {
//         const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user,repo,security_events`;

//         res.redirect(url);
//     } catch (error) {
//         res.status(500).json({ msg: "failed to login with github", Error: error.message })
//     };
// };

// const fetchGithubAccessToken = async (req, res) => {
//     try {
//         const { code } = req.query;

//         if (!code) return res.status(400).json("required code not found");

//         const tokenResponse = await axios.post("https://github.com/login/oauth/access_token", {
//             client_id: process.env.GITHUB_CLIENT_ID,
//             client_secret: process.env.GITHUB_CLIENT_SECRET,
//             code,
//         },
//             { header: { Accept: "application / json" } }
//         );

//         const accessToken = tokenResponse.data.access_token

//         const data = storeCaptain("github", accessToken);

//         if (!data) return res.status(400).json("failed to save captain");

//         const token = jwt.sign({ captain_id: data.id }, process.env.JWT_SECRET);

//         captainCookies(res, token);

//         res.redirect(process.env.FRONTEND_URL);
//     } catch (error) {
//         res.status(500).json({ msg: "failed to fetch github access token", Error: error.message })
//     }
// };

const googleLogin = (req, res) => {
    try {
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_url=${process.env.BACKEND_URL}/auth/google/callback&response_type=code&scope=profile`;

        res.redirect(url);
    } catch (error) {
        res.status(500).json({ msg: "failed to login with google", Error: error.message })
    }
};

const fetchGoogleAccessToken = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) return res.status(400).json("required code not found!");

        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: authorization_code,
            redirect_url: `${process.env.BACKEND_URL}/auth/google/callback`
        },
            {
                header: { "Content-Type": "application / x - www - form - urlencoded" }
            }
        );

        const accessToken = tokenResponse.data.access_token;

        const data = storeOauthUser("google", accessToken);

        if (!data) return res.status(400).json("failed to save captain details");

        const token = jwt.sign({ captain_id: data.id }, process.env.JWT_SECRET);

        captainCookies(res, token);

        res.redirect(process.env.FRONTEND_URL);
    } catch (error) {
        res.status(500).json({ msg: "failed to fetch google access token", Error: error.message })
    }
};

const verifyCaptain = async (req, res) => {
    try {

        const license = req.files["license"][0];
        const panCard = req.files["panCard"][0];

        const captainId = req.captainId;

        if (!captainId) return res.status(401).json("captain details missing!, unauthorize captain");

        const existCaptain = await verificationModel.findOne({ where: { captainId } });

        if (existCaptain) return res.status(400).json("verification details already submitted");

        if (!license || !panCard) return res.status(400).json("required file not found");

        const filePath = { license, panCard };

        const fetchCaptain = await captainModel.findOne({ where: { id: captainId } });

        const uploadData = await cloudinaryUpload(filePath);

        const { username: captainName, id } = fetchCaptain;
        const { licenseResponse: { secure_url: license_url }, panCardResponse: { secure_url: panCard_url } } = uploadData;

        await verificationModel.create({ captainName, license_url, panCard_url, captainId: id });

        res.status(201).json({ msg: "captain verification details successfully added" });
    } catch (error) {
        res.status(500).json({ msg: "failed to verify captain", Error: error.message })
    }
};

const fetchCaptainProfile = async (req, res) => {
    try {
        const id = req.captainId;

        if (!id) return res.status(400).json("captain id missing!, captain not authorized");

        const fetchCaptain = await captainModel.findOne({ where: { id }, include: verificationModel });

        if (!fetchCaptain) return res.status(404).json("captain not found");

        res.status(200).json({ msg: "captain successfully fetched", fetchCaptain });
    } catch (error) {
        res.status(500).json({ msg: "failed to fetch captain profile", Error: error.message })
    }
};

const toggleCaptainAvailability = async (req, res) => {
    try {
        const captainId = req.captainId;

        if (!captainId) return res.status(400).json("required details not found");

        const captain = await captainModel.findOne({ where: { id: captainId } });

        captain.isAvailable = !captain.isAvailable;

        await captain.save();

        res.status(200).json("captain availability successfully updated");

    } catch (error) {
        res.status(500).json({ msg: "failed to update captain availability", Error: error.message })
    }
};

const pendingResponse = [];

const fetchUserRide = async (req, res) => {
    try {
        req.setTimeout(30000, () => {
            res.status(204).send();
        });

        pendingResponse.push(res);

        subscribeToQueue("new-ride", async (msg) => {
            const data = JSON.parse(msg);

            pendingResponse.forEach((res) => {
                res.json(data);
            });

            pendingResponse.length = 0;
        });
    } catch (error) {
        res.status(500).json({ msg: "failed to fetch new user rides", Error: error.message })
    }
};


module.exports = { register, login, googleLogin, fetchGoogleAccessToken, verifyCaptain, fetchCaptainProfile, toggleCaptainAvailability, fetchUserRide };