const express = require('express');
const routes  = express.Router();
const AdminController = require("../controllers/AdminController/AdminController");

routes.put('/approve/:ownerId', AdminController.approveOwner );
routes.get('/owner-request', AdminController.ownerRequest);
routes.get('/get-owners-list',AdminController.getAllOwnersList);
routes.get('/get-customers-list',AdminController.getAllCustomersList);


//yogesh deore
routes.put("/customer-status",AdminController.deactivateCustomer);
routes.put("/owner-status",AdminController.deactivateOwner)

module.exports = routes ;