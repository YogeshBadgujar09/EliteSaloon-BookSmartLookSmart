const OwnerModel = require("../../models/OwnerModel");
const emailSendOptimizeCode = require("../../utils/emailSendOptimizeCode");

exports.approveOwner = async (req, res) =>{

    const subject = "Owner Request for Elite Saloon Account ... !!!";
    const message = "Congratulation ... !!! \n\nYour Requested is ACCEPTED by ADMIN.\n\n" +
                    "Now you can manage your customers and products." +
                    "Thank You\n\nEliteSaloon" ;

    const { ownerEmail, ownerAccountStatus, ownerApprovedStatus } = req.body;

    const owner = await OwnerModel.findOne({ ownerEmail});

    if(owner !== null && owner.ownerAccountStatus === "DEACTIVE" && owner.ownerApprovedStatus === "PENDING"){

        owner.ownerAccountStatus = ownerAccountStatus ;
        owner.ownerApprovedStatus = ownerApprovedStatus ;
        owner.ownerUpdatedAt = Date.now();
        await owner.save()

        console.log("APPROVE");
        res.status(200).json({
            message : "ACCEPT"
        });

       emailSendOptimizeCode(owner.ownerEmail, subject, message);
        
    }else{
        console.log("NOT APPROVE ");
        res.status(401).json({
            message : "NOT ACCEPT"
        });
    }
    
}