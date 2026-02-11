const CustomerModel = require('../../models/CustomerModel');
const bcrypt = require('bcrypt');
const sendEmail = require('../../mail/emailSender');
const generateOTP = require('../../util/generateOTP');
/**
 * Author : Yogesh Badgujar
 * Date : 06-02-2026    
 * Description : This is the controller for customer registration. It handles the logic for registering a new customer.
 * @param {*} req - In this function, we are receiving the request body which contains the customer details that we want to save in the database.
 * @param {*} res - In this function, we are sending the response back to the client after processing the registration request.
 *                  We will send a success message if the registration is successful, or an error message if there is an issue with the registration process.
 * @returns - In this function, we will return a JSON response to the client indicating the success or failure of the registration process.
 *            If the registration is successful, we will return a message indicating that the customer has been registered successfully. If there is an error during the registration process,
 *            we will return an error message with details about the issue.
 */
exports.registerCustomer = async (req, res) => {

    const subject = "Mail for Register in Elite Saloon";
    const message = "Please enter OTP for customer registration in Elite Saloon\n\n Your OTP is :";
        
    try{

        const { customerUsername, customerEmail } = req.body;
        console.log("Request Body Username :" + customerUsername);
        console.log("Request Body Email :" + customerEmail);

        let existingCustomer = await CustomerModel.findOne({ customerUsername  });
        let existingEmail = await CustomerModel.findOne({ customerEmail  });

        console.log("Existing Customer :" + existingCustomer);
        console.log("Existing Email :" + existingEmail);

        /**
         * This condition is added to handle the case when a customer tries to register with an email that has already been used for registration but the email is not verified yet. 
         * In this case, we will delete the existing customer data associated with that email and allow the new registration to proceed. 
         * This way, we can ensure that only one customer can register with a particular email address, and if the email is not verified, we can allow another customer to register with the same email address without any issues.
         */
        if(existingEmail == null && existingCustomer != null && existingCustomer.customerVerified === false){
            console.log("delete this data because email is not varified ... !!!");
            await CustomerModel.deleteOne({ customerUsername });
            existingCustomer = null; // Set existingCustomer to null after deleting the existing customer data

            console.log("Existing Customer after deletion :" + existingCustomer);
        }

        if (existingCustomer == null && existingEmail == null) {
            
            console.log("You can save data ... !!!");
            const customer = new CustomerModel(req.body) ;

            customer.customerPassword = bcrypt.hashSync(req.body.customerPassword, 10);   

            //print customer data in console for checking data before saving in database
            console.log(customer);

            //By default, multer will save the uploaded file in the specified destination folder and provide the file path in req.file.path. We can directly assign this path to the customerProfileImage field in our customer model before saving it to the database.
            customer.customerProfileImage = req.file.path ;

            //  // Send email to customer for OTP verification
            customer.customerOTP = await generateOTP(); // Generate OTP and store it in the variable
            console.log("genarated OTP :" + customer.customerOTP);

            customer.customerVerified = false; // Set customerVerified to false until OTP is verified

            // Save customer BEFORE sending response to ensure that the OTP is stored in the database and can be verified later
            await customer.save();

            //Know send OTP email to the customer after saving the customer data in the database, so that we can verify the OTP later when the customer tries to verify their email address. 
            // This way, we ensure that the OTP is stored in the database and can be used for verification when needed.
            const emailSent = await sendEmail(customer.customerEmail, subject, message + customer.customerOTP); // Send email with OTP to the customer's email address

            if (!emailSent) {
                return res.status(500).json({ message: "OTP server failed to send OTP email" });
            }else{
                return res.status(200).json({
                        message: "OTP sent successfully. Please verify. You can redirect to OTP verification page",
                        customerUsername: customer.customerUsername
                });
            }

        }else{

            if (existingCustomer != null) {
                console.log("Username already exists");
                return res.status(400).json({ message: 'Username already exists' });
            }
            if (existingEmail != null) {
                console.log("Email already exists");
                return res.status(400).json({ message: 'Email already exists' });
            }
           
        }

    }catch(error){
            res.status(500).json({
                error: "Internal error in Customer Saving",
                details: error.message
            });
    }
}


/**
 * Author : Yogesh Badgujar
 * Date : 06-02-2026
 * Description : This is the controller for customer login. It handles the logic for authenticating a customer based on their username and password.
 * @param {*} req - In this function, we are receiving the request body which contains the customer login credentials (username and password) that we want to authenticate against the database.
 * @param {*} res - In this function, we are sending the response back to the client after processing the login request. We will send a success message if the login is successful, or an error message if there is an issue with the login process.
 * @returns - In this function, we will return a JSON response to the client indicating the success or failure of the login process. If the login is successful,
 *            we will return a message indicating that the customer has logged in successfully. If there is an error during the login process, we will return an error message with details about the issue.
 */

exports.loginCustomer = async (req, res) => {

    // console.log("Inside Customer Login Controller");

    try {
        const { customerUsername, customerPassword } = req.body;    

        const customer = await CustomerModel.findOne({ customerUsername });
        console.log("Customer Data print :", customer);

        if (customer != null ) {
            
            const isMatch = await bcrypt.compare(customerPassword, customer.customerPassword);
            console.log("Password Match Result :" + isMatch);

            // Check if the password matches and the customer is verified and active
            if (isMatch && customer.customerVerified && customer.customerStatus === "active") { 
                    res.status(200).json({
                    message: "Customer Login Successful"
                    // customer: customer
                    });
            }else{
                return res.status(401).json({
                    message: "Invalid Password"
                });
            }

        }else{
            // console.log("Invalid Username or Password");
            res.status(401).json({
                message: "Username does not exist"
            });
        }

    }
    catch (error) {

        console.log("Error in Customer Login :", error.message);
        res.status(500).json({
            error: "Internal error in Customer Login", 
            details: error.message
        });
    }               
}   


exports.verifyOTP = async (req, res) => {

    try {
        const { customerUsername, otp } = req.body; 
        console.log("OTP received from client :" + otp);

        const customer = await CustomerModel.findOne({ customerUsername });
        console.log("Customer Data for OTP verification :", customer);  
        
        if (customer != null) {
            
            if (customer.customerOTP === otp) { 

                customer.customerVerified = true; // Set customerVerified to true after successful OTP verification
                customer.customerOTP = null; // Clear the OTP after successful verification
                customer.customerStatus = "active"; // Update customer status to active after successful verification

                await customer.save();
                console.log("OTP verification successful");
                res.status(200).json({ message: "OTP verification successful" });
            } else {
                console.log("OTP verification failed");
                res.status(400).json({ message: "OTP verification failed" });
            }   
        } else {
            console.log("Customer not found for OTP verification");
            res.status(404).json({ message: "Customer not found" });
        }       
    } catch (error) {
        console.log("Error in OTP verification :", error.message);
        res.status(500).json({
            error: "Internal error in OTP verification",
            details: error.message
        });
    }
}