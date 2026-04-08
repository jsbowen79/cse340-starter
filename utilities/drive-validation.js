const { body, validationResult } = require("express-validator")
const detailsModel = require("../models/inventory-details-model")
const driveCont = require("../controllers/driveController")
const utilities = require("../utilities/index")

const validate = {}

/**************************************************************************************
 * Test Drive Data Validation Rules
 *********************************************************************************** */
//customer_name is required and must be a string of at least length 2
validate.driveRules = () => {
    return [
        body("customer_name")
            .trim()
            .matches(/^[A-Za-z\s]+$/)
            .notEmpty().withMessage("Please enter your name to schedule a test drive.")
            .isLength(2).withMessage("Please enter at least 2 characters."),
    
        body("drive_date")
            .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Please choose a date (YYYY-MM-DD)")
            .custom((value) => {
                const dateObj = new Date(value);

                if (isNaN(dateObj.getTime())) {
                    throw new Error("That does not appear to be a date, please choose a date.");
                }
                const today = new Date();
                today.setHours(0, 0, 0, 0)
                if (dateObj < today) {
                    throw new Error("That date has already passed. Please choose a date in the future.");
                }
                return true;
            })
    ];
}

/****************************************************************************************
 * Check Drive data and return errors or continue to update database
 ************************************************************************************** */

validate.checkDriveData = async (req, res, next) => {
    const { customer_name, drive_date, inv_id, host_id, drive_time } = req.body;
    
    let errors = []; 
    errors = validationResult(req)
 
    if (!errors.isEmpty()) {
        const vehicleDetails = await detailsModel.getProductDetail(inv_id);
           const hostSelect = await driveCont.populateHost(); 
           const vehicleName = `${vehicleDetails.inv_year} ${vehicleDetails.inv_make} ${vehicleDetails.inv_model}`
           const details = await utilities.buildProductDetail(vehicleDetails);
           let nav = await utilities.getNav()
        const message = errors.msg; 
        res.render("./drive/schedule", {
            title: `Schedule a Test Drive - ${vehicleName}`,
            nav,
            message: null,
            details,
            hostSelect,
            accountData: res.locals.accountData || null,
            inv_id,
            errors,
            message
        })
        return
        }
        next()
    }


module.exports =  validate 