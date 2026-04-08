const inventoryDetailsModel = require("../models/inventory-details-model"); 
const utilities = require("../utilities"); 

const detailCont = {}; 

//Build Inventory Details view //

detailCont.buildProductDetail = async function (req, res, next) {
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
        message: null
    })
}



module.exports = detailCont; 