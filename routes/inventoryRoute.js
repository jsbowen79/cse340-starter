//Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const processRules = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build Add Classification View
router.get("/add-classification",
    utilities.authorization,
    utilities.handleErrors(invController.buildAddClassification))

//Route to build Add Inventory View
router.get("/add-inventory",
    utilities.authorization,
    utilities.handleErrors(invController.buildAddInventory))

//Route to Inventory Management view
router.get("/management",
    utilities.authorization,
    utilities.handleErrors(invController.buildManagement)); 

//Route to get Inventory by Classification ID
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//Route to edit inventory page
router.get("/edit/:inv_id",
    utilities.authorization,
    utilities.handleErrors(invController.buildEditInventory))

//Route to delete inventory item page
router.get("/delete/:inv_id",
    utilities.authorization,
    utilities.handleErrors(invController.buildDeleteInventory))


//Route to submit inventory edits
router.post("/update/",
    utilities.authorization,
    processRules.inventoryRules(),
    processRules.checkUpdateData,
    invController.updateInventory
)

//Process the Add Classification Request
router.post(
    "/add-classification", 
    utilities.authorization,
    processRules.classificationRules(),
    processRules.checkClassData,
    utilities.handleErrors(invController.processAddClassification)
)

//Process the Add Inventory Request
router.post(
    "/add-inventory", 
    utilities.authorization,
    processRules.inventoryRules(),
    processRules.checkInventoryData,
    utilities.handleErrors(invController.processInventory)
)

//Process to Delete a vehicle from inventory
router.post("/delete",
    utilities.authorization,
    utilities.handleErrors(invController.deleteVehicle))

module.exports = router; 