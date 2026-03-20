const express = require("express"); 
const router = new express.Router(); 
const testController = require("../controllers/testController"); 

//route that triggers 500 error
router.get("/error", testController.trigger)
module.exports = router; 