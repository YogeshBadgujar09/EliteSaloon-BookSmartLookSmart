const express = require('express');
const routes  = express.Router();
const upload = require('../middleware/upload');
const CustomerController = require('../controllers/CustomerController/CustomerController');

routes.post('/register', upload.single('customerProfileImage'), CustomerController.registerCustomer);
routes.get('/login', CustomerController.loginCustomer);
routes.post('/verifyotp', CustomerController.verifyOTP);
routes.post('/forgotpassword', CustomerController.forgotPassword);
routes.post('/matchotp', CustomerController.matchOTP);
routes.post('/resetpassword', CustomerController.resetPassword);

module.exports = routes;

