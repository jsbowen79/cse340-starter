const inventoryDetailsModel = require("../models/inventory-details-model"); 
const utilities = require("../utilities"); 

const detailCont = {}; 

//Build Inventory Details view //

detailCont.buildProductDetail = async function (req, res, next) {
    //debugging 
    console.log("🚗 ROUTE HIT WITH ID:", req.params.id);
    const inv_id = req.params.id; 
    const data = await inventoryDetailsModel.getProductDetail(inv_id); 
    const details = await utilities.buildProductDetail(data); 
    let nav = await utilities.getNav(); 
    const makeModel = `${data.inv_make} ${data.inv_model}`; 
    res.render("./inventory/productDetails", {
        title: makeModel, 
        nav, 
        details,
        errors: null,
    })
    console.log("CONTROLLER DATA:", data)
    console.log("RENDERING DETAILS:", details);

}



module.exports = detailCont; 