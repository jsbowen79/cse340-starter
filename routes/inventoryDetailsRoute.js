const express = require("express"); 
const router = new express.Router(); 
const inventoryDetailsController = require("../controllers/inventoryDetailsController"); 

//Route to build inventory details view
router.get("/:id", inventoryDetailsController.buildProductDetail); 


module.exports = router; 