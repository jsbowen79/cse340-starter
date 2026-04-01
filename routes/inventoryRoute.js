//Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const processRules = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build Add Classification View
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

//Route to build Add Inventory View
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

//Route to Inventory Management view
router.get("/management", utilities.handleErrors(invController.buildManagement)); 

//Route to get Inventory by Classification ID
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//Route to edit inventory page
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory))

//Rout to submit inventory edits
router.post("/update/",
    processRules.inventoryRules(),
    processRules.checkUpdateData,
    invController.updateInventory
)

//Process the Add Classification Request
router.post(
    "/add-classification",  
    processRules.classificationRules(),
    processRules.checkClassData,
    utilities.handleErrors(invController.processAddClassification)
)

//Process the Add Inventory Request
router.post(
    "/add-inventory", 
    processRules.inventoryRules(),
    processRules.checkInventoryData,
    utilities.handleErrors(invController.processInventory)
)

module.exports = router; 