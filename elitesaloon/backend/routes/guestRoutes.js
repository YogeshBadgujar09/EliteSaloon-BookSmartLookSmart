const express = require("express");
const router = express.Router();
const GuestController = require("../controllers/GuestController/GuestController");


router.get("/allservices",  GuestController.getAllServicesForGuest);
router.get("/allproducts", GuestController.getAllProductsForGuest);
module.exports = router;