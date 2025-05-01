const { uploadToCloudinary } = require("../config/cloudinaryConfig");
const fs = require("fs");
const path = require("path");

const cloudinaryUpload = async (filePath) => {
    try {
        const response = await uploadToCloudinary(filePath);

        const fetchRootDirectory = path.dirname(__dirname);

        const uploadDir = path.resolve(fetchRootDirectory, "uploads");

        fs.readdir(uploadDir, (err, files) => {

            if (err) return console.log("failed to read folder");


            files.forEach(file => {

                const filePath = path.resolve(uploadDir, file)
                const fileExt = path.extname(filePath);

                if (!filePath) return console.error("deleted file not found");

                if (fileExt !== ".txt") {
                    fs.unlink(filePath, err => {
                        if (err) return console.error(err);
                    })
                }
            });
        });

        return response;

    } catch (error) {
        console.log(error);
    }
};

const captainCookies = (res, token) => {
    res.cookie("capToken", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
    })
}
module.exports = { cloudinaryUpload, captainCookies };
