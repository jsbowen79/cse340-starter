const express = require("express"); 
const router = new express.Router(); 
const driveController = require("../controllers/driveController")
const utilities = require("../utilities")
const driveValidate = require("../utilities/drive-validation")

//Route to build Schedule Test Drive view
router.get("/times", utilities.handleErrors(driveController.getDriveTimes))

router.get("/schedule/:inv_id",
    utilities.handleErrors(driveController.buildDrive))

router.post("/update",
    driveValidate.driveRules(),
    driveValidate.checkDriveData,
    utilities.handleErrors(driveController.submitTestDrive))


module.exports = router; 