const OwnerModel = require("../../models/OwnerModel");
const CustomerModel = require("../../models/CustomerModel");
const AppointmentModel = require("../../models/AppointmentModel");
const emailSendOptimizeCode = require("../../utils/emailSendOptimizeCode");

exports.approveOwner = async (req, res) => {
  const { ownerId } = req.params;
  const { ownerApprovedStatus } = req.body;

  const owner = await OwnerModel.findOne({ _id: ownerId });

  if (owner !== null) {
    let wishesh = "";
    let status = "";
    const subject = "Owner Request for Elite Saloon Account ... !!!";

    if (ownerApprovedStatus === "APPROVE") {
      wishesh = "Congratulations ... ";
      status =
        ownerApprovedStatus +
        "\n\n For login first time, Please reset password ...!!!";

      owner.ownerApprovedStatus = ownerApprovedStatus;
      owner.ownerAccountStatus = "ACTIVE";
      owner.ownerUpdatedAt = Date.now();
      await owner.save();
    } else {
      wishesh = "Hard luck ";
      status = ownerApprovedStatus;

      owner.ownerApprovedStatus = ownerApprovedStatus;
      owner.ownerAccountStatus = "DEACTIVE";
      owner.ownerUpdatedAt = Date.now();
      await owner.save();
    }

    let message =
      `${wishesh}...!!!\n\nYour request has been reviewed by ADMIN.\n\n` +
      `You are ${status}` +
      `Thank You\nEliteSaloon`;

    res.status(200).json({
      message: "DONE",
    });

    emailSendOptimizeCode(owner.ownerEmail, subject, message);
  }
};
exports.ownerRequest = async (req, res) => {
  try {
    const owners = await OwnerModel.find({
      ownerVerified: true,
      ownerAccountStatus: "DEACTIVE",
      ownerApprovedStatus: "PENDING",
    });

    if (!owners || owners.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No pending owners found",
      });
    }

    res.status(200).json({
      success: true,
      count: owners.length,
      data: owners,
    });
  } catch (error) {
    console.error("Error fetching pending owners:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getAllOwnersList = async (req, res) => {
  try {
    const owners = await OwnerModel.find({
      ownerVerified: true,
      ownerApprovedStatus: "APPROVE",
    }).select("-ownerPassword -ownerOTP"); // exclude password

    if (!owners || owners.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No approved owners found",
      });
    }

    console.log("Owners :", owners);

    res.status(200).json({
      success: true,
      count: owners.length,
      data: owners,
    });
  } catch (error) {
    console.error("Error fetching owners:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getAllCustomersList = async (req, res) => {
  try {
    const customers = await CustomerModel.find({
      customerVerified: true,
      customerStatus: "active",
    }).select("-customerPassword -customerOTP"); // exclude password

    if (!customers || customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active customers found",
      });
    }
    res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deactivateCustomer = async (req, res) => {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID required",
      });
    }

    const customer = await CustomerModel.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // customer.customerStatus =
    //     customer.customerStatus === "ACTIVE"
    //         ? "DEACTIVE"
    //         : "ACTIVE";

    customer.customerStatus =
      customer.customerStatus === "active" ? "deactive" : "active";

    await customer.save();

    let wishesh = "Hello User";
    let status = customer.customerStatus;

    const subject = "Customer Account Active/Deactive... !!!";

    let message =
      `${wishesh}...!!!\n\nYour Account has been ${status} By Admin.\n\n` +
      `Thank You\nEliteSaloon`;

    res.status(200).json({
      success: true,
      message: `Customer status changed to ${customer.customerStatus}`,
      data: customer,
    });

    emailSendOptimizeCode(customer.customerEmail, subject, message);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// yogesh deore owner active -> deactive
exports.deactivateOwner = async (req, res) => {
  try {
    const { ownerId } = req.body;

    if (!ownerId) {
      return res.status(400).json({
        success: false,
        message: "Owner ID required",
      });
    }

    const owner = await OwnerModel.findById(ownerId);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    owner.ownerAccountStatus =
      owner.ownerAccountStatus === "ACTIVE" ? "DEACTIVE" : "ACTIVE";

    await owner.save();

    let wishesh = "Hello User";
    let status = owner.ownerAccountStatus;

    const subject = "Saloon Owner Account Active/Deactive... !!!";

    let message =
      `${wishesh}...!!!\n\nYour Account has been ${status} By Admin.\n\n` +
      `Thank You\nEliteSaloon`;

    res.status(200).json({
      success: true,
      message: `Owner status changed to ${owner.ownerAccountStatus}`,
      data: owner,
    });

    emailSendOptimizeCode(owner.ownerEmail, subject, message);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// yogesh deore counting of customers and owners
exports.totalActiveCustomers = async (req, res) => {
    try {

        const count = await CustomerModel.countDocuments({
            customerStatus: "active"
        });

        res.status(200).json(count);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

exports.totalDeactiveCustomers = async (req, res) => {
    try {

        const count = await CustomerModel.countDocuments({
            customerStatus: "deactive"
        });

        res.status(200).json(count);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

exports.totalActiveOwners = async (req, res) => {
    try {

        const count = await OwnerModel.countDocuments({
            ownerAccountStatus: "ACTIVE"
        });

        res.status(200).json(count);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


exports.totalDeactiveOwners = async (req, res) => {
    try {

        const count = await OwnerModel.countDocuments({
            ownerAccountStatus: "DEACTIVE"
        });

        res.status(200).json(count);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


exports.totalApprovedOwners = async (req, res) => {
    try {

        const count = await OwnerModel.countDocuments({
            ownerApprovedStatus: "APPROVE"
        });

        res.status(200).json(count);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

exports.totalPendingOwners = async (req, res) => {
    try {

        const count = await OwnerModel.countDocuments({
            ownerApprovedStatus: "PENDING"
        });

        res.status(200).json(count);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

exports.totalConfirmedOwners = async (req, res) => {
    try {

        const count = await OwnerModel.countDocuments({
            ownerVerified: true
        });

        res.status(200).json(count);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

exports.totalCustomers = async (req, res) => {
    try {

        const count = await CustomerModel.countDocuments();

        res.status(200).json(count);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

exports.totalOwners = async (req, res) => {
    try {

        const count = await OwnerModel.countDocuments();

        res.status(200).json(count);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


exports.totalAppointments = async (req, res) => {
    try {

        const count = await AppointmentModel.countDocuments();

        res.status(200).json(count);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};