//Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const loginValidate = require('../utilities/account-validation')

// Route to build account Login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegistration)); 

//Process logout
router.get("/logout/", utilities.handleErrors(accountController.logout))

//Route for Account Management view
router.get("/", utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)); 

  //Manage account Changes
router.get("/update/:account_id",
    utilities.handleErrors(accountController.accountUpdate)) 

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

//Process the login attempt
router.post("/login",
  loginValidate.loginRules(),
  loginValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin))

//Update Account information
router.post("/update/info", 
  regValidate.updateAccountRules(),
  utilities.handleErrors(accountController.updateAccount)
)

//Update Password
router.post("/update/password",
  regValidate.updatePasswordRules(), 
   
  utilities.handleErrors(accountController.updatePassword)
)


module.exports = router;