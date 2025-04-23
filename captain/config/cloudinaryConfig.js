// require("dotenv").config();
const { v2: cloudinary } = require("cloudinary");

const cloudinaryConfig = () => {
    cloudinary.config();
};

const uploadToCloudinary = async (filePath) => {
    try {
        cloudinaryConfig();

        const { license, panCard } = filePath

        if (!filePath) return resizeBy.status(400).json("required upload file not found!");


        const licenseResponse = await cloudinary.uploader.upload(license.path, {
            folder: "rider verification Data",
        });

        const panCardResponse = await cloudinary.uploader.upload(panCard.path, {
            folder: "rider verification Data",
        });
        
        const response = { licenseResponse, panCardResponse };
        console.log(response);

        return response;
    } catch (error) {
        console.log(error);
    }
};

module.exports = { uploadToCloudinary };