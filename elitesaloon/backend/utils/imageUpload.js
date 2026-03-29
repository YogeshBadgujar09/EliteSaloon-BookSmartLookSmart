const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        let uploadPath = "C:/uploadEliteSaloonImages";
        
        if(file.fieldname === "customerProfileImage"){
              uploadPath = "C:/uploadEliteSaloonImages/customerProfile";
        }
       
        if(
            file.fieldname === "ownerShopCertificate" ||
            file.fieldname === "shopFrontPhoto" ||
            file.fieldname === "shopInsidePhoto"
        ){
              uploadPath = "C:/uploadEliteSaloonImages/shopImage";
        }
        if(file.fieldname === "serviceImages"){
            uploadPath = "C:/uploadEliteSaloonImages/serviceImages";
        }
        if(file.fieldname === "productImages"){
             uploadPath = "C:/uploadEliteSaloonImages/productImages";
        }if(file.fieldname === "staffProfile"){
              uploadPath = "C:/uploadEliteSaloonImages/staffProfiles";
        }if (file.fieldname === "ownerProfileImage") {
            uploadPath = "C:/uploadEliteSaloonImages/ownerProfile";
        }


        // Create folder if not exists
        if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);

    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename using the current timestamp and original file extension
    }
});

// Initialize multer with the defined storage engine
const upload = multer({ storage: storage });

module.exports = upload;

// // File filter to accept only images
// const fileFilter = (req, file, cb) => {
//     const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//     const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
//     const ext = path.extname(file.originalname).toLowerCase();
    
//     if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only image files are allowed (jpg, png, gif, webp)'), false);
//     }
// };

// // Configure multer
// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: {
//         fileSize: 5 * 1024 * 1024 // 5MB limit
//     }
// });

// module.exports = upload;
