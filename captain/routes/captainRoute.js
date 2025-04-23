const { Router } = require("express");
const { register, login, googleLogin, fetchGoogleAccessToken, verifyCaptain, fetchCaptainProfile, toggleCaptainAvailability, fetchUserRide } = require("../controller/createCaptain");
const { auth } = require("../middleware/auth");
const { upload } = require("../middleware/multer");
const multer = require("multer");
const { UNEXPECTED_FILE_TYPE } = require("../constants");

const route = Router();


function uploadFile(req, res, next) {
    upload(req, res, err => {
        if (err instanceof multer.MulterError) {
            if (err === UNEXPECTED_FILE_TYPE.code) return res.status(400).json({ error: { field: err.field, description: err.message } });
        } else if (err) {
            return res.status(500).json({ msg: "failed to upload", error: err.message });
        }
        next();
    });

};

route.post("/register", register);
route.post("/login", login);
// route.post("/github", githubLogin);
// route.post("/github/callback", fetchGithubAccessToken);
route.post("/google", googleLogin);
route.post("/google/callback", fetchGoogleAccessToken);
route.post("/upload/verification/data", auth, uploadFile, verifyCaptain);
route.get("/captain/profile", auth, fetchCaptainProfile);
route.patch("/captain/availability",auth, toggleCaptainAvailability);
route.get("/fetch/ride", auth, fetchUserRide);

module.exports = { route };