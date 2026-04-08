const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */


async function buildLogin (req, res, next) {
    const message = req.query.message || null; 
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null, 
        message
    })
}

/*******************************************
 * Deliver Registration View
 ******************************************/

async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register", 
        nav,
        errors: null,
        message:null
    })
}


/*******************************************
 * Process Registration
 ***************************************** */

async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    let hashedPassword
    try {
        hashedPassword=await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        console.log("password processing failure")
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
            message: 'Sorry, there was an error processing the registration.'
        })
    }
    
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname, 
        account_email, 
        hashedPassword
    )

    if (regResult) {
        console.log("success")
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            message: `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        })
    } else {
        console.log("serverfailure")
        res.status(501).render("account/register", {
            title: "Registration", 
            nav,
            errors: null,
            message: 'Sorry, the registration failed.'
        })
    }
}

/***************************************************************************
 * Process Login Request
 ************************************************************************ */

async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)


    if (!accountData) {
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
            message: 'Please check your credentials and try again.'
        })
        return
    }
    try {

        if (await bcrypt.compare(account_password, accountData.account_password)) {
            console.log("Password Matches")
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
            } else {
                res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")

        } else {
            res.status(400).render("account/login", {
                console.log("Password doesn't match")
                title: "Login", 
                nav, 
                errors: null, 
                account_email,
                message: 'Please check your credentials and try again.'
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden', error)
    }
}

/*****************************************************************************************************
 * Logout view
 ************************************************************************************************** */
async function logout(req, res, next) {
    res.clearCookie("jwt"); 
    res.redirect("/"); 
}

/*****************************************************************************************************
 * Build Account Management View
 ************************************************************************************************** */
async function buildAccountManagement(req, res, next) {
    const message = req.query.message || null; 
    let nav = await utilities.getNav()
    res.render("account/accountManagement", {
        title: "Account Management", 
        nav,
        errors: null,
        message,
    })
}

/*******************************************
 * Deliver Account Update View
 ******************************************/

async function accountUpdate(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/accountUpdate", {
        title: "Update Account Information", 
        nav,
        errors: null,
        message:null

    })
}

/*********************************************************************************************************************
 * Process Update Password 
 ****************************************************************************************************************** */

async function updatePassword(req, res) {
    let nav = await utilities.getNav()
    let hashedPassword;
    const { confirmPassword, currentPassword, newPassword } = req.body
    const account_id = res.locals.accountData.account_id; 

    try {
        const account = await accountModel.getAccountById(account_id);
        const match = await bcrypt.compare(currentPassword, account.account_password);
         
        if (!match) {
            return res.render("/account/accountUpdate", {
                title: "Update Account",
                nav,
                errors: {
                    array: () => [{ msg: "Current Password did not match" }]
                },
                message:null
            });
        }
    } catch (error) {
        return res.status(500).render("/account/accountUpdate", {
            title: " Update Account",
            nav,
            errors: null,
            message: 'Sorry, there was an error validating your current password.'
        })
    }
    const errors = validationResult(req); 

    if (!errors.isEmpty()) {
        return res.render("/account/accountUpdate", {
            title: "Update Account",
            nav,
            errors,
            message:null
        });
    }

    hashedPassword = await bcrypt.hashSync(confirmPassword, 10); 
    try {
        await accountModel.updatePassword(account_id, hashedPassword);
    } catch (error) {
        return res.status(500).render("account/accountUpdate", {
            title: "Account Management", 
            nav,
            errors: null,
            message:'Sorry, there was a database error updating the password.  Try again.'
            })
    }

    const accountData = await accountModel.getAccountById(account_id)

    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
    } else {
        res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    req.flash("showAccount", true); 
    return res.redirect("/account/?message=Password%20Updated%20Successfully");
}
    
/*********************************************************************************************************************
 * Process Update Account 
 ****************************************************************************************************************** */

async function updateAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email } = req.body;
    const account_id = res.locals.accountData.account_id; 

    const errors = validationResult(req); 

    if (!errors.isEmpty()) {
        return res.render("account/accountUpdate", {
            title: "Update Account",
            nav,
            errors,
            message: null
        });
    }

    try {
        await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email);
    } catch (error) {
        return res.status(500).render("account/accountUpdate", {
            title: "Account Management", 
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
            message: 'Sorry, there was a database error updating your account.  Try again.'
            })
    }
    res.clearCookie("jwt"); 
    const accountData = await accountModel.getAccountByEmail(account_email)


    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000})
    } else {
        res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }
    req.flash("showAccount", true); 
    return res.redirect("/account/?message=Password%20Updated%20Successfully");
}
         
    

module.exports = { logout, registerAccount, buildLogin, buildRegistration, accountLogin, buildAccountManagement, accountUpdate, updatePassword, updateAccount }