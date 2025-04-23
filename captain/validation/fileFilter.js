const path = require("path");


const fileFilter = (file) => {
    try {
        const fileType = /jpeg|jpg/;
        const checkFileExtension = fileType.test(path.extname(file.originalname.toLowerCase()));
        const checkMimeType = fileType.test(file.mimetype);

        return checkFileExtension && checkMimeType;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = { fileFilter };