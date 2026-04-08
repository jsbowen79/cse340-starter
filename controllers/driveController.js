const driveModel = require("../models/drive-model")
const utilities = require("../utilities")
const detailsModel = require("../models/inventory-details-model")
/*******************************************************************************
 * Build  Drive  View
 ***************************************************************************** */
async function buildDrive(req, res, next) {
    console.log("in drive controller")

    const msg = req.query.msg || null; 
    const success = "Your test drive has been scheduled."
    const vehicle = "The vehicle is booked for that time slot.  Choose another time.";
    const host = "Sorry, Your host is busy.  Choose another time.";
    const unknown = "Unable to schedule appointment";
    
    let message = null; 
    if (msg === "success") message = success; 
    if (msg === "vehicle") message = vehicle; 
    if (msg === "host") message = host; 
    if (msg === "unknown") message = unknown; 
    console.log("message", message)

    const inv_id = req.params.inv_id
    const vehicleDetails = await detailsModel.getProductDetail(inv_id);
    const hostSelect = await populateHost(); 
    const vehicleName = `${vehicleDetails.inv_year} ${vehicleDetails.inv_make} ${vehicleDetails.inv_model}`
    const details = await utilities.buildProductDetail(vehicleDetails);
    let nav = await utilities.getNav()
    res.render("./drive/schedule", {
        title: `Schedule a Test Drive - ${vehicleName}`,
        nav, 
        message,
        details,
        hostSelect,
        accountData: res.locals.accountData || null,
        inv_id,
        errors: null, 
        message
    })
}

/* *************************************************************************************************************
 * Populate hosts Select element
 ************************************************************************************************************* */
async function populateHost() {
    const availableHosts = await driveModel.getHosts();
    let template = "<option value='' selected>Make A Selection</option>"; 
    availableHosts.forEach(host => {
        template += `<option value="${host.account_id}">${host.name}</option>`
    });
    return template; 
}

/* *************************************************************************************************************
 * Get Drive Times from Model, Calculate available times and return to frontend
 ************************************************************************************************************* */
async function getDriveTimes(req, res) {
    const { host_id, drive_date } = req.query;
    const response = await driveModel.getHostSchedule(host_id, drive_date);

    const allTimes = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"]
    
    if (response.length > 0) {
        const availableTimes = allTimes.filter(
            time => !response.includes(time)
        );
        res.json(availableTimes)
    } else {
        res.json(allTimes);
    }
}

async function submitTestDrive(req, res, next) {
    const { inv_id, host_id, customer_name, drive_date, drive_time } = req.body; 
    


    let customer_id = null; 
    let final_name = customer_name; 
    if (res.locals.accountData) {
        customer_id = res.locals.accountData.account_id; 
        final_name = `${res.locals.accountData.account_firstname} ${res.locals.accountData.account_lastname}`
    }

 
    const result = await driveModel.updateAppointment(inv_id, host_id, customer_id, final_name, drive_date, drive_time); 
    const message = result.message


    if (result.success) {
        return res.redirect(`/drive/schedule/${inv_id}/?msg=success`);
    } else if (!result.success && result.message === 1) {
        return res.redirect(`/drive/schedule/${inv_id}?msg=vehicle`);
    }else if (!result.success && result.message === 2){
        return res.redirect(`/drive/schedule/${inv_id}?msg=host`);
    } else {
        return res.redirect(`/drive/schedule/${inv_id}?msg=unknown`);
    }

    }


module.exports = { buildDrive, populateHost, populateHost, getDriveTimes, submitTestDrive }
