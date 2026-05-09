const express = require('express');
const routes  = express.Router();
const AdminController = require("../controllers/AdminController/AdminController");

routes.post('/login',AdminController.loginAdmin);
routes.put('/approve/:ownerId', AdminController.approveOwner );
routes.get('/owner-request', AdminController.ownerRequest);
routes.get('/get-owners-list',AdminController.getAllOwnersList);
routes.get('/get-customers-list',AdminController.getAllCustomersList);

routes.get("/get-deactive-customers-list",AdminController.getDeactiveCustomersList);
routes.get("/get-deactive-owners-list", AdminController.getDeactiveOwnersList);

routes.put("/customer-status",AdminController.deactivateCustomer);
routes.put("/owner-status",AdminController.deactivateOwner)



// customer count   
routes.get("/total-customers", AdminController.totalCustomers);
routes.get("/active-customers-count", AdminController.totalActiveCustomers);
routes.get("/deactive-customers-count", AdminController.totalDeactiveCustomers);

// owner count
routes.get("/total-owners", AdminController.totalOwners);
routes.get("/active-owners-count", AdminController.totalActiveOwners);
routes.get("/deactive-owners-count", AdminController.totalDeactiveOwners);
routes.get("/approved-owners-count", AdminController.totalApprovedOwners);
routes.get("/pending-owners-count", AdminController.totalPendingOwners);
routes.get("/confirmed-owners-count", AdminController.totalConfirmedOwners);

//appointment count
routes.get("/total-appointments", AdminController.totalAppointments);


//
routes.get("/dashboard-stats", AdminController.getAdminDashboardStats);


module.exports = routes ;