const OwnerModel = require("../../models/OwnerModel");
const bcrypt = require("bcrypt");
const emailSendOptimizeCode = require("../../utils/emailSendOptimizeCode");
const generateOTP  = require("../../utils/generateOTP");
const ServiceModel = require("../../models/ServiceModel");
const ProductModel = require("../../models/ProductModel");
const StaffModel = require("../../models/StaffModel");

exports.registerOwner = async (req, res) => {

    const subject = "Mail for Register Owner in Elite Saloon";
    let message = "Please enter OTP for Owner registration in Elite Saloon\n\n Your OTP is :";


    try {

        const { ownerEmail } = req.body;
        
        console.log("Request data :", req.body );


        let existingOwner = await OwnerModel.findOne({ ownerEmail });

        console.log("Data :" ,existingOwner);

        if(existingOwner != null && !existingOwner.ownerVerified 
             && existingOwner.ownerAccountStatus === "DEACTIVE")
        {
            console.log("Delete unverified Recorde .... !!! ");
            await OwnerModel.deleteOne({ownerEmail});
            existingOwner = null;
        }
        
        if(existingOwner === null)    {

            //check images are not null
            if (!req.files) {
                return res.status(400).json({ message: "Images are required" });
            }

            //Images add to request 
            req.body.ownerShopCertificate = req.files.ownerShopCertificate[0].path;
            req.body.shopFrontPhoto = req.files.shopFrontPhoto[0].path;
            req.body.shopInsidePhoto = req.files.shopInsidePhoto[0].path;

            const owner = new OwnerModel( req.body );

            let tempPassword = passwordGenTemps();
            owner.ownerPassword = await bcrypt.hash( tempPassword.toString(), 10);

            let otp = await generateOTP();
            message = message + otp ;
            
            const generatedOTP = await emailSendOptimizeCode(
                    owner.ownerEmail,
                    subject,
                    message,
            );
            
            if (generatedOTP) {
              // Check if OTP generation and email sending was successful

                owner.ownerOTP = otp; // Generate OTP and store it in the customer's record in the database
               
                // Save Owner BEFORE sending response to ensure that the OTP is stored in the database and can be verified later
                await owner.save();

                res.status(201).json({ 
                        message: "Redirect To Verification Otp Page", 
                        ownerEmail : owner.ownerEmail
                });

            } else {
                res.status(500).json({
                message: "Failed to send OTP to customer email",
                });
            }

        }else{
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });  
         }
       
    } catch (error) {
        res.status(500).json({ message: "Error registering owner", error: error.message });
    }
};

function passwordGenTemps(){
      return Math.floor(100000 + Math.random() * 900000).toString();
}


exports.loginOwner = async(req, res) => {
    
    const { ownerEmail, ownerPassword } = req.body;

    const owner = await OwnerModel.findOne({ownerEmail});

    // console.log(owner);

    if(owner != null && owner.ownerVerified && 
      owner.ownerAccountStatus === "ACTIVE" &&
      owner.ownerApprovedStatus === "ACCEPT" 
    ){
        const isMatch = await bcrypt.compare(
                ownerPassword,
                owner.ownerPassword);

        if(isMatch){
          res.status(200).json({
            message: "Owner Login Successful",
            owner : owner.toObject()
          });
        }else{
          res.status(401).json({
            message : "Password is invalid ... !!!"
          });
        }

    }else{

      if(owner == null ){
        res.status(401).json({
          message: "Email does not exist",
        });
      }else if( owner.ownerAccountStatus !== "ACTIVE" && owner.ownerApprovedStatus !== "ACCEPT") {
        res.status(401).json({
          message: "You are not APPROVED By admin",
        });
      }else{
          res.status(401).json({
          message: "You are temprory Deactivated By ADMIN",
        });
      }
      
    }
};


exports.verifyOTP = async (req, res) => {
  try {
    const { ownerEmail, otp } = req.body;
    console.log("OTP received from owner :" + otp);

    const owner =  await OwnerModel.findOne({ ownerEmail });

    if (owner != null) {
      if (owner.ownerOTP === otp) {
        owner.ownerVerified = true; // Set customerVerified to true after successful OTP verification
        owner.ownerOTP = null; // Clear the OTP after successful verification
        owner.ownerUpdatedAt = Date.now();
        await owner.save();

        res.status(200).json({
          message: "OTP verification successfull .... Wait for approvals"
        });
      } else {
        res.status(400).json({ message: "enter valid OTP" });
      }
    } else {
      console.log("owner not found for OTP verification");
      res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.log("Error in OTP verification :", error.message);
    res.status(500).json({
      error: "Internal error in OTP verification",
      details: error.message,
    });
  }
};


exports.forgotPassword = async (req, res) => {
  const { ownerEmail } = req.body;
  const owner = await OwnerModel.findOne({ownerEmail});

  if (owner != null) {
    let subject = "Mail for Reset Password in Elite Saloon";
    let message = "Please enter OTP for reset password in Elite Saloon\n\n Your OTP is :";
    let otp = await generateOTP();
    
    message = message + otp ;

    const generatedOTP = await emailSendOptimizeCode(
      ownerEmail,
      subject,
      message,
    );

    if (generatedOTP) {
      owner.ownerOTP = otp; // Store the generated OTP in the customer's record in the database
      await owner.save(); // Save the updated customer record with the new OTP

      res.status(200).json({
        message:
        "OTP sent successfully to owner email ... redirect to OTP verification page for reset password",
        ownerEmail : owner.ownerEmail,
      });
    } else {
      res.status(500).json({
        message: "Failed to send OTP to owner email",
      });
    }
  } else {
    res.status(404).json({
      message: "Owner not found with the provided email address",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { ownerEmail, newPassword } = req.body;
  const owner = await OwnerModel.findOne({ownerEmail});
  if (owner != null) {
    owner.ownerPassword = bcrypt.hashSync(newPassword, 10); // Hash the new password before saving
    owner.ownerOTP = null;
    owner.ownerUpdatedAt = Date.now();
    await owner.save();
    res.status(200).json({
      message: "Password reset successful",
    });
  }
};

exports.addService = async (req, res) => {

    try {
        const serviceImages = req.files.map(file => file.filename);

        const ownerId = req.body.ownerId;   // if using auth middleware

        // Create service
        const service = new ServiceModel({
            ...req.body,
            ownerId: ownerId,
            serviceImages: serviceImages
        });

        await service.save();

        res.status(201).json({
            success: true,
            message: "Service Added Successfully",
            service
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error Adding Service",
            error: error.message
        });

    }

};

exports.updateService = async (req, res) => {

    try {

        const { serviceId } = req.params;
        const { ownerId } = req.body;

        console.log("Service Id:", serviceId);
        console.log("Owner Id:", ownerId);
        console.log("Body:", req.body);

        // Find service with owner check
        const service = await ServiceModel.findOne({
            _id: serviceId,
            ownerId: ownerId
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service Not Found or Unauthorized"
            });
        }

        // Update fields
        Object.assign(service, req.body);

        // Handle images
        if (req.files && req.files.length > 0) {
            const serviceImages = req.files.map(file => file.filename);
            service.serviceImages = serviceImages;
        }

        await service.save();

        res.status(200).json({
            success: true,
            message: "Service Updated Successfully",
            service
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error Updating Service",
            error: error.message
        });

    }

};

exports.searchServices = async (req, res) => {

   try {

        const { serviceId } = req.params;
        const { ownerId } = req.bod;   // send ownerId in query

        console.log("Service Id:", serviceId);
        console.log("Owner Id:", ownerId);

        const service = await ServiceModel.findOne({
            _id: serviceId,
            ownerId: ownerId
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Service Fetched Successfully",
            service
        });

   } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error Searching Service",
            error: error.message
        });

   }

};

exports.viewAllServices = async (req, res) => {

    try {

        const { ownerId } = req.body;

        const services = await ServiceModel.find({ ownerId: ownerId });

        res.status(200).json({
            success: true,
            totalServices: services.length,
            message: "Owner services fetched successfully",
            services
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error fetching services",
            error: error.message
        });

    }

};

exports.deleteService = async (req, res) => {

    try {

        const { serviceId } = req.params;
        const { ownerId } = req.body;

        console.log("Service Id:", serviceId);
        console.log("Owner Id:", ownerId);

        const service = await ServiceModel.findOneAndDelete({
            _id: serviceId,
            ownerId: ownerId
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service Not Found or Unauthorized"
            });
        }

        res.status(200).json({
            success: true,
            message: "Service Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error Deleting Service",
            error: error.message
        });

    }

};

exports.addProduct = async (req, res) => {
    try {

        const productImages = req.files.map(file => file.filename);

        const product = new ProductModel(req.body);

        product.productImages = productImages;

        await product.save();

        res.status(201).json({
            success: true,
            message: "Product Added Successfully",
            product
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error Adding Product",
            error: error.message
        });

    }
};

exports.viewAllProducts = async (req, res) => {

    try {

        const { ownerId } = req.body;

        const products = await ProductModel.find({ ownerId: ownerId });

        res.status(200).json({
            success: true,
            totalProducts: products.length,
            products
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error Fetching Products",
            error: error.message
        });

    }

};

exports.searchProduct = async (req, res) => {

    try {

        const { productId } = req.params;

        const product = await ProductModel.findOne({
            _id: productId,
            ownerId: req.body.ownerId
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found or Unauthorized"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error Fetching Product",
            error: error.message
        });

    }

};

exports.updateProduct = async (req, res) => {

    try {

        const { productId } = req.params;
        console.log("Product Id",productId);
        const updateData = req.body;
        console.log("Data :", updateData);

        if (req.files && req.files.length > 0) {
            updateData.productImages = req.files.map(file => file.filename);
        }

        const product = await ProductModel.findOneAndUpdate(
            { _id: productId, ownerId: req.body.ownerId },  // added owner check
            updateData,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found or Unauthorized"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product Updated Successfully",
            product
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error Updating Product",
            error: error.message
        });

    }

};

exports.deleteProduct = async (req, res) => {

    try {

        const { productId } = req.params;

        const product = await ProductModel.findOneAndDelete({
            _id: productId,
            ownerId: req.body.ownerId
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product Not Found or Unauthorized"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error Deleting Product",
            error: error.message
        });

    }

};

exports.addStaff = async (req, res) => {

    const subject = "Staff Registration in Elite Saloon";
    let message = "Please enter OTP for Staff Verification in Elite Saloon\n\n Your OTP is : ";

    try {

        const { staffEmail } = req.body;

        console.log("Request Data :", req.body);

        let existingStaff = await StaffModel.findOne({ staffEmail });

        console.log("Existing Staff :", existingStaff);

        // Delete old unverified staff
        if (
            existingStaff !== null &&
            !existingStaff.isVerified
        ) {
            console.log("Deleting old unverified staff...");
            await StaffModel.deleteOne({ staffEmail });
            existingStaff = null;
        }

        if (existingStaff === null) {

            const staff = new StaffModel(req.body);

                req.body.staffProfile = req.file.path;
            

            // Generate OTP
            let otp = await generateOTP();

            message = message + otp;

            const generatedOTP = await emailSendOptimizeCode(
                staff.staffEmail,
                subject,
                message
            );

            if (generatedOTP) {

                staff.staffOTP = otp;

                await staff.save();

                res.status(201).json({
                    success: true,
                    message: "Redirect To Staff OTP Verification Page",
                    staffEmail: staff.staffEmail
                });

            } else {

                res.status(500).json({
                    success: false,
                    message: "Failed to send OTP to staff email"
                });

            }

        } else {

            return res.status(409).json({
                success: false,
                message: "Staff Email Already Exists"
            });

        }

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error Adding Staff",
            error: error.message
        });

    }

};

exports.staffOTPverify = async (req, res) => {
  try {
    const { staffEmail, otp } = req.body;
    const staff = await StaffModel.findOne({staffEmail});

    if (staff != null) {
      if (staff.staffOTP == otp) {

        staff.isVerified = true ;
        staff.staffOTP = null ;
        
        await staff.save();

        res.status(200).json({
          message: "OTP verification successfull ... !!!"
        });
      } else {
        res.status(400).json({ message: "enter valid OTP" });
      }
    } else {
      res.status(404).json({ message: "staff not found" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal error in OTP verification",
      details: error.message,
    });
  }
};

exports.updateStaff = async (req, res) => {

    try {

        const { staffId } = req.params;

        console.log("Staff ID :", staffId);
        console.log("Body Data :", req.body);

        const staff = await StaffModel.findById(staffId);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found"
            });
        }

        // Update fields
        if (req.body.staffName) {
            staff.staffName = req.body.staffName;
        }

        if (req.body.staffPhone) {
            staff.staffPhone = req.body.staffPhone;
        }

        if (req.body.staffAddress) {
            staff.staffAddress = req.body.staffAddress;
        }

        // Update profile image if new file uploaded
        if (req.file) {
            staff.staffProfile = req.file.path;
        }

        await staff.save();

        res.status(200).json({
            success: true,
            message: "Staff updated successfully",
            staff
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error updating staff",
            error: error.message
        });

    }

};

exports.deleteStaff = async (req, res) => {

    try {

        const { staffId } = req.params;

        console.log("Deleting Staff ID :", staffId);

        const staff = await StaffModel.findById(staffId);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: "Staff not found"
            });
        }

        await StaffModel.findByIdAndDelete(staffId);

        res.status(200).json({
            success: true,
            message: "Staff deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error deleting staff",
            error: error.message
        });

    }

};

exports.getOwnerStaff = async (req, res) => {

    try {

        const { ownerId } = req.params;

        console.log("Owner ID :", ownerId);

        const staffList = await StaffModel.find({
            ownerId: ownerId,
            isVerified: true
        });

        res.status(200).json({
            success: true,
            totalStaff: staffList.length,
            staff: staffList
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error fetching staff list",
            error: error.message
        });

    }

};