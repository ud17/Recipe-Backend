const multer = require("multer");

const fileStorage = multer.diskStorage({

    destination: (req , file, cb) => {
        cb(null, 'uploads/');
    },

    filename: (req , file, cb) => {
        var uid = Math.floor(100000000 + Math.random() * 800000000);
        cb(null, `${uid}-${file.originalname}`);
    }
});

const uploadRecipeImage = multer({storage: fileStorage});
module.exports = uploadRecipeImage;