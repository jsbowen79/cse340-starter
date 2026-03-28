//Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const processClassification = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build Add Classification View
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

//Route to build Add Inventory View
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

//Route to Inventory Management view
router.get("/management", utilities.handleErrors(invController.buildManagement)); 


//Process the Add Classification Request
router.post(
    "/add-classification",  
    processClassification.classificationRules(),
    processClassification.checkClassData,
    utilities.handleErrors(invController.processAddClassification)
)

//Process the Add Inventory Request
router.post(
    "/add-inventory", 
    processClassification.inventoryRules(),
    processClassification.checkInventoryData,
    utilities.handleErrors(invController.processInventory)
)

module.exports = router; 