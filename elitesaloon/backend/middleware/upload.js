const multer = require('multer');
const path = require('path');

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the directory where uploaded files will be stored  
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename using the current timestamp and original file extension
    }
});

// Initialize multer with the defined storage engine
const upload = multer({ storage: storage });

module.exports = upload;