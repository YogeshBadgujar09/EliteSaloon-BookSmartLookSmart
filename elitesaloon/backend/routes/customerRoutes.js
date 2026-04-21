const express = require('express');
const routes  = express.Router();
// const upload = require('../middleware/upload');
const imageUpload = require("../utils/imageUpload");
const CustomerController = require('../controllers/CustomerController/CustomerController');
const Customer = require('../models/CustomerModel');

// routes.post('/register', upload.single('customerProfileImage'), CustomerController.registerCustomer);
routes.post('/register', CustomerController.registerCustomer);

routes.post('/login', CustomerController.loginCustomer);
routes.post('/verifyotp', CustomerController.verifyOTP);
routes.post('/forgotpassword', CustomerController.forgotPassword);
// routes.post('/matchotp', CustomerController.matchOTP);
routes.post('/resetpassword', CustomerController.resetPassword);

//for imsge
routes.post('/uploadprofile', imageUpload.single('customerProfileImage'), CustomerController.uploadProfileImage);routes.put(
  '/update-profile/:id',
  imageUpload.single('customerProfileImage'), 
  CustomerController.updateCustomerProfile
);
routes.post(
  '/change-password/:id',
  CustomerController.changeCustomerPassword
);

routes.get("/get-product-customer/:customerPincode", CustomerController.getProductsForCustomerByPin);
routes.get("/get-service-customer/:customerPincode", CustomerController.getServiceForCustomerByPin);

module.exports = routes;

