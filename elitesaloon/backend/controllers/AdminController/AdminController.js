const OwnerModel = require("../../models/OwnerModel");
const CustomerModel = require("../../models/CustomerModel");
const emailSendOptimizeCode = require("../../utils/emailSendOptimizeCode");

exports.approveOwner = async (req, res) =>{

    const {ownerId } = req.params;
    const { ownerApprovedStatus } = req.body;

    const owner = await OwnerModel.findOne({ _id : ownerId });

    if(owner !== null ){

            let wishesh = "";
            let status = "";
            const subject = "Owner Request for Elite Saloon Account ... !!!";

            if (ownerApprovedStatus === "APPROVE") {

                wishesh = "Congratulations ... ";
                status = ownerApprovedStatus + "\n\n For login first time, Please reset password ...!!!";

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

            let message = `${wishesh}...!!!\n\nYour request has been reviewed by ADMIN.\n\n` +
                        `You are ${status}` +
                        `Thank You\nEliteSaloon`;

            res.status(200).json({
                message: "DONE"
            });

            emailSendOptimizeCode(owner.ownerEmail, subject, message);
        
    }
    
}

exports.ownerRequest = async(req,res) =>{

      try {
        const owners = await OwnerModel.find({
            ownerVerified :true,
            ownerAccountStatus: "DEACTIVE",
            ownerApprovedStatus: "PENDING"
        });

        if (!owners || owners.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pending owners found"
            });
        }

        res.status(200).json({
            success: true,
            count: owners.length,
            data: owners
        });

    } catch (error) {
        console.error("Error fetching pending owners:", error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}

exports.getAllOwnersList = async (req, res) => {
    try {
        const owners = await OwnerModel.find({
            ownerVerified: true,
            ownerApprovedStatus: "APPROVE"
        }).select("-ownerPassword -ownerOTP"); // exclude password

        if (!owners || owners.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No approved owners found"
            });
        }

        console.log("Owners :", owners);

        res.status(200).json({
            success: true,
            count: owners.length,
            data: owners
        });

    } catch (error) {
        console.error("Error fetching owners:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

exports.getAllCustomersList = async (req, res) => {
    try {
        const customers = await CustomerModel.find({
            customerVerified: true,
            customerStatus: "active"
        }).select("-customerPassword -customerOTP"); // exclude password
        
        if (!customers || customers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No active customers found"
            });
        }
        res.status(200).json({
            success: true,
            count: customers.length,
            data: customers
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
