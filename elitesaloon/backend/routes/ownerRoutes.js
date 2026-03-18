const express = require("express");
const router = express.Router();
const OwnerController = require('../controllers/OwnerController/OwnerController');
const imageUpload = require("../utils/imageUpload");

// routes.post('/register', OwnerController.registerOwner);
router.post(
  "/register",
  imageUpload.fields([
    { name: "ownerShopCertificate", maxCount: 1 },
    { name: "shopFrontPhoto", maxCount: 1 },
    { name: "shopInsidePhoto", maxCount: 1 }
  ]),
  OwnerController.registerOwner
);

router.post("/login", OwnerController.loginOwner);
router.post("/verifyotp", OwnerController.verifyOTP );
router.post("/forgotpassword", OwnerController.forgotPassword);
router.post("/resetpassword", OwnerController.resetPassword);

//Services Operation
router.post("/add-service", imageUpload.array("serviceImages", 3), OwnerController.addService);
router.put("/update-service/:serviceId", imageUpload.array("serviceImages", 3), OwnerController.updateService);
router.put("/search-service/:serviceId", OwnerController.searchServices);
// router.get("/viewall-service", OwnerController.viewAllServices);
router.delete("/delete-service/:serviceId", OwnerController.deleteService);

router.get("/allservices/:ownerId", OwnerController.searchServicesByOwnerId);


//Product Operation
router.post("/add-product", imageUpload.array("productImages",3),OwnerController.addProduct);
router.get("/viewall-products/:ownerId", OwnerController.viewAllProductsByOwnerId);
router.get("/search-product/:productId", OwnerController.searchProduct);
router.put("/update-product/:productId", imageUpload.array("productImages",3), OwnerController.updateProduct);
router.delete("/delete-product/:productId", OwnerController.deleteProduct);

//Staff Operation 
router.post("/add-staff", imageUpload.single("staffProfile"),OwnerController.addStaff);
router.post("/staff-verify", OwnerController.staffOTPverify);
router.put("/staff-update/:staffId", imageUpload.single("staffProfile"),OwnerController.updateStaff);
router.delete("/staff-delete/:staffId", OwnerController.deleteStaff);
router.get("/staff-list/:ownerId", OwnerController.getOwnerStaff);

module.exports = router;