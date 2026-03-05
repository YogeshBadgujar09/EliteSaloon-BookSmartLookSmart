const express = require('express');
const routes  = express.Router();
const AdminController = require("../controllers/AdminController/AdminController");

routes.post('/approve', AdminController.approveOwner );

module.exports = routes ;