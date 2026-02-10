const express = require('express');
const routes  = express.Router();
const multer = require('multer');
const upload = require('../middleware/upload');
const CustomerController = require('../controllers/CustomerController/CustomerController');

routes.post('/register', upload.single('customerProfileImage'), CustomerController.registerCustomer);
routes.get('/login', CustomerController.loginCustomer);

module.exports = routes;

