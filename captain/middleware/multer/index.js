const multer = require("multer");
const path = require("path");
const { UNEXPECTED_FILE_TYPE } = require("../../constants");
const { fileFilter } = require("../../validation/fileFilter");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const verifyFileType = fileFilter(file);
        if (verifyFileType) return cb(null, file);

        cb(new multer.MulterError(UNEXPECTED_FILE_TYPE.code, UNEXPECTED_FILE_TYPE.message));
    }
}).fields([
    { name: "license", maxCount: 1},
    { name: "panCard", maxCount: 1},
]);

module.exports = { upload };