const { default: axios } = require("axios");
const usersModel = require("../models/users.model");

const userCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    });
};


const storeOauthUser = async (access_token, provider) => {
    try {

        if (!access_token || !provider) return false;

        if (provider === "github") {

            const fetchUser = await axios.get("https://api.github.com/user", {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            const { id } = fetchUser.data;
            const existUser = usersModel.findOne({ where: { oauth_id: id } });

            if (existUser) return existUser;

            const { name, email } = fetchUser;
            const user = await usersModel.create({ username: name, email, oauth_id: id });

            return user;

        } else if (provider === "google") {

            const fetchUser = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            const { id } = fetchUser.data;
            const existUser = usersModel.findOne({ where: { oauth_id: id } });

            if (existUser) return existUser;

            const { name, email } = fetchUser;
            const user = await usersModel.create({ username: name, email, oauth_id: id });

            return user;
        }
        return false;

    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = { userCookie, storeOauthUser };