const express = require("express"); 
const router = new express.Router(); 
const inventoryDetailsController = require("../controllers/inventoryDetailsController"); 
const utilities = require("../utilities")

//Route to build inventory details view
router.get("/:id", utilities.handleErrors(inventoryDetailsController.buildProductDetail)); 


module.exports = router; 