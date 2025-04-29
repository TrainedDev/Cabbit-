const { Router } = require("express");
const { auth } = require("../middleware");
const { register, login, githubLogin, fetchGithubAccessToken, googleLogin, fetchGoogleAccessToken, userProfile, acceptedRide } = require("../controller/createUser");


const route = Router();

route.post("/register", register);
route.post("/login", login);
route.get("/github", githubLogin);
route.post("/github/callback", fetchGithubAccessToken);
route.post("/google", googleLogin);
route.post("/google/callback", fetchGoogleAccessToken);
route.get("/profile", auth, userProfile);
route.get("/user/ride/status", auth, acceptedRide);

module.exports = { route };