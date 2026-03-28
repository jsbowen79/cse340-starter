const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/**************************************************************************************
 * Registration Data Validation Rules
 *********************************************************************************** */

  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), 
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty().withMessage("Please Enter your last name.")
        .isLength({ min: 2 }).withMessage("Your last name is not valid (length)."),
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty().withMessage("Please provide an email.")
      .isEmail().withMessage("This does not appear to be an email address.")
      .normalizeEmail() 
        .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists) {
            throw new Error ("Email exists.  Please log in or use a different email")
          }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty().withMessage("Please provide your password.")
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet complexity requirements."),
    ]
  }

  /**************************************************************************************
   * Login Validation Rules
   *********************************************************************************** */

validate.loginRules= () => {
  return [
    body("account_email")
      .trim()
      .escape()
      .notEmpty().withMessage("Please provide your email.")
      .isEmail().withMessage("This does not appear to be an email address.")
      .normalizeEmail()
      .withMessage("A valid email is required."),
      // .custom(async (account_email) => {
      //   const emailExists = await accountModel.checkExistingEmail(account_email)
      //   if (!emailExists) {
      //     throw new Error("There is no account with that email.  Please choose a different email or click \"Register\" to register")
      //   }
      // }), 
      body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
    ]
  }

/****************************************************************************************
 * Check registration data and return errors or continue to registration
 ************************************************************************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
}
  
/**************************************************************************************
 * Check login data and return errors or return to login
 *********************************************************************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors, 
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
  }  


  module.exports = validate