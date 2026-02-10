const CustomerModel = require('../../models/CustomerModel');
const bcrypt = require('bcrypt');

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
        
    try{

        const { customerUsername } = req.body;
        console.log("Request Body Username :" + customerUsername);

        const existingCustomer = await CustomerModel.findOne({ customerUsername  });
        console.log("Existing Customer :" + existingCustomer);

        if (existingCustomer == null) {
            
            console.log("You can save data ... !!!");
            const customer = new CustomerModel(req.body) ;

            customer.customerPassword = bcrypt.hashSync(req.body.customerPassword, 10);

            //print customer data in console for checking data before saving in database
            console.log(customer);

            customer.customerProfileImage = req.file.path ;

            await customer.save();
    
            res.status(201).json({
                message : "Customer Registered Successfully ... !!!"
            });

        }else{
            console.log("Username already exists");
            return res.status(400).json({ message: 'Username already exists' });
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

            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid Password"
                });
            }

            // console.log("Customer Login Successful");
            res.status(200).json({
                message: "Customer Login Successful",
                // customer: customer
            });

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