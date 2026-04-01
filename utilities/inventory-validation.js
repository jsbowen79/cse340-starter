const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const invValidate = {}

/****************************************************************************************
 * Add Classification Rules
 ************************************************************************************** */
invValidate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty().withMessage("Please make an entry.")
      .isAlpha().withMessage("Your entry must meet naming requirements")
      .escape(),
  ]
}

/****************************************************************************************
 * Add Inventory Rules
 ************************************************************************************** */
invValidate.inventoryRules = () => {
    console.log('In rules');
  return [
    body("inv_make")
      .trim()
      .notEmpty().withMessage("Please make an entry for vehicle Make.")
      .isAlpha().withMessage("Please enter a vehicle Make (letters only)"),
      
    body("inv_model")
        .trim()
        .notEmpty().withMessage("Please enter a vehicle Model")
        .matches(/^[A-Za-z0-9' -]+$/).withMessage("Please enter a vehicle Model (letters and numbers only)"),
    
    body("inv_year")
        .trim()
        .notEmpty().withMessage("Please enter a year.")
        .isInt().withMessage("Please enter a Year (Integer)"),
    
    body("inv_description")
        .trim()
        .notEmpty().withMessage("Please enter a Description")
        .isLength({min:20, max:500}).withMessage("Please enter a vehicle description (20 - 500 characters)"),

    body("inv_image")
        .trim()
        .custom((value) => {
            // allow empty (so I can set a default later)
            if (!value) return true;
        
            const isRelative = /^\/images\/[A-Za-z0-9_\-\/\.]+$/.test(value);
            const isFullUrl = /^https?:\/\/.+\..+/.test(value);
        
            if (isRelative || isFullUrl) {
              return true;
            }
        
            throw new Error("Must be a valid image path or full URL");
        }),
         
     
    body("inv_thumbnail")
        .trim()
        .custom((value) => {
            // allow empty (so I can set a default later)
            if (!value) return true;
        
            const isRelative = /^\/images\/[A-Za-z0-9_\-\/\.]+$/.test(value);
            const isFullUrl = /^https?:\/\/.+\..+/.test(value);
        
            if (isRelative || isFullUrl) {
              return true;
            }
        
            throw new Error("Must be a valid image path or full URL");
        }),
         

    body("inv_price")
        .trim()
        .notEmpty().withMessage("Please enter a price")
        .isInt().withMessage("Please enter a price (Integer)"),

    body("inv_miles")
        .trim()
        .notEmpty().withMessage("Please make a mileage entry")
        .isInt().withMessage("Please enter vehicle mileage (Integer)"),

    body("inv_color")
        .trim()
        .notEmpty().withMessage("Please enter a color")
        .isAlpha().withMessage("Please enter a color (letters)"),
    ]     
}

/****************************************************************************************
 * Check Classification data and return errors or continue to Add Classification
 ************************************************************************************** */
invValidate.checkClassData = async (req, res, next) => {
    const classification_name = req.body
    let errors = []
    errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav(); 
        res.render("inventory/add-classification", {
            errors,
            title: "Add a Vehicle Classification",
            nav, 
            classification_name, 
        })
        return
    }
    next()
}

/****************************************************************************************
 * Check Inventory data and return errors or continue to Add Inventory
 ************************************************************************************** */
invValidate.checkInventoryData = async (req, res, next) => {

    console.log("checking Data")
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
        inv_price, inv_miles, inv_color, classification_id} = req.body
    let errors = []
    console.log("Errors: ", errors)
        errors = validationResult(req)
        if (!errors.isEmpty()) {
            let nav = await utilities.getNav(); 
            const classification_id = req.body?.classification_id || null;
            let classificationList = await utilities.buildClassificationList(classification_id);
            res.render("inventory/add-inventory", {
                errors,
                title: "Add a Vehicle to Inventory",
                nav, 
                classificationList,
                inv_make,
                inv_model,
                inv_year,
                inv_description,
                inv_image,
                inv_thumbnail,
                inv_price,
                inv_miles,
                inv_color,
                classification_id 
            })
            return
        }
        next()
    }
    
    /****************************************************************************************
     * Check Inventory data and return errors or continue to Edit Inventory View
     ************************************************************************************** */
    invValidate.checkUpdateData = async (req, res, next) => {
    console.log("In checkUpdateData")
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
        inv_price, inv_miles, inv_color, classification_id, inv_id} = req.body
        
        let errors = []
        console.log("Errors: " , errors); 
        errors = validationResult(req)
        if (!errors.isEmpty()) {
            let nav = await utilities.getNav(); 
            const classification_id = req.body?.classification_id || null;
            let classificationList = await utilities.buildClassificationList(classification_id);
            res.render("inventory/edit-inventory", {
                errors,
                title: `Edit Inventory: ${inv_make} ${inv_model}`,
                nav, 
                classificationList,
                inv_make,
                inv_model,
                inv_year,
                inv_description,
                inv_image,
                inv_thumbnail,
                inv_price,
                inv_miles,
                inv_color,
                inv_id,
                classification_id 
            })
            return
        }
        console.log("leaving updateInventoryData")
        next()
}


module.exports = invValidate