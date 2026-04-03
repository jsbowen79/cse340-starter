const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")


/* ***************************
 *  Build inventory by classification view
 * ************************** */
async function buildByClassificationId (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null, 
  })
}

/*******************************************************************************
 * Build  Edit Inventory View
 ***************************************************************************** */

async function buildEditInventory(req, res, next) {
  let nav = await utilities.getNav(); 
  const inv_id = parseInt(req.params?.inv_id) || null; 
  const inventoryData = await invModel.retrieveDataById(inv_id); 

  const classificationList = await utilities.buildClassificationList(inventoryData.classification_id);
  const name = `${inventoryData[0].inv_make} ${inventoryData[0].inv_model}`; 

  res.render("inventory/edit-inventory", {
    title: `Edit Inventory: ${name}`,
    nav,
    inv_make : inventoryData[0].inv_make,
    inv_model : inventoryData[0].inv_model,
    inv_year : inventoryData[0].inv_year,
    inv_description : inventoryData[0].inv_description,
    inv_image : inventoryData[0].inv_image, 
    inv_thumbnail : inventoryData[0].inv_thumbnail, 
    inv_price : inventoryData[0].inv_price, 
    inv_miles : inventoryData[0].inv_miles, 
    inv_color : inventoryData[0].inv_color,
    classification_id : inventoryData[0].classification_id,
    classificationList,
    inv_id : inventoryData[0].inv_id,
    errors: null,
  })
}

/* ***********************************************************************************************
 *  Update Inventory Data
 * ******************************************************************************************** */
async function updateInventory(req, res, next) {
  
  let nav = await utilities.getNav()
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
    inv_id
  )


  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const name = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + name,
    nav,
    classificationList,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/*******************************************************************************
 * Build Management View
 ***************************************************************************** */

async function buildManagement (req, res, next) {
  let nav = await utilities.getNav(); 
  const classificationList = await utilities.buildClassificationList(); 

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationList, 
    errors: null,
  })
}

/*******************************************************************************
 * Build Add Classification View
 ***************************************************************************** */

async function buildAddClassification (req, res, next) {
  let nav = await utilities.getNav(); 
  res.render("inventory/add-classification", {
    title: "Add a Vehicle Classification",
    nav,
    errors: null,
  })
}

/*******************************************************************************
 * Build Add Inventory View
 ***************************************************************************** */

async function buildAddInventory(req, res, next) {
  let nav = await utilities.getNav(); 
  const classification_id = req.body?.classification_id || null;
  let classificationList = await utilities.buildClassificationList(classification_id);
  ("Controller", classificationList); 
  res.render("inventory/add-inventory", {
    title: "Add a Vehicle Classification",
    nav,
    classificationList,
    errors: null,
  })
}


/*******************************************************************************
 * Process Add Vehicle Classification
 ***************************************************************************** */
async function processAddClassification(req, res) {
  const {classification_name} = req.body
  const addResult = await invModel.processAddClassification(classification_name)
  
  if (addResult) {
    let nav = await utilities.getNav(); 
    req.flash("notice", `${classification_name} has been added as a new vehicle classification!`),
    
    res.status(201).render("inventory/add-classification", {
      title: "Add a Vehicle Classification",
      nav,
      errors: null, 
    })
  } else {
    let nav = await utilities.getNav(); 
    req.flash("notice", "Sorry, there was an error adding the vehicle classification.")
    res.status(501).render("inventory/add-classification", {
      title: "Add a Vehicle Classification", 
      nav,
      errors: null,
    })
  }
}

/*******************************************************************************
 * Process Add Inventory
 ***************************************************************************** */
async function processInventory(req, res) {
  const { inv_year, inv_image, inv_thumbnail,
    inv_price, inv_miles, classification_id } = req.body
  let { inv_make, inv_model, inv_description, inv_color } = req.body
  
  inv_make = capitalizeFirst(inv_make);
  inv_model = capitalizeFirst(inv_model); 
  inv_description = capitalizeFirst(inv_description); 
  inv_color = capitalizeFirst(inv_color); 

  if (!inv_image || inv_image.trim() === "") {
    image_url = "/images/vehicles/no-image.png"; 
  }
  
  if (!inv_thumbnail || inv_thumbnail.trim() === "") {
    image_url = "/images/vehicles/no-image-tn.png"; 
  }

  const result = await invModel.processAddInventory(inv_make, inv_model, inv_year,
    inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,
    classification_id)

  if (result) {
    let nav = await utilities.getNav(); 
    const classification_id = req.body?.classification_id || null;
    let classificationList = await utilities.buildClassificationList(classification_id);
    req.flash("notice", `${inv_make} ${inv_model} has been added to the inventory!`),
    
    res.status(201).render("inventory/add-inventory", {
      title: "Add a Vehicle to Inventory",
      nav,
      classificationList, 
      errors: null, 
    })
  } else {
    let nav = await utilities.getNav(); 
    const classification_id = req.body?.classification_id || null;
    let classificationList = await utilities.buildClassificationList(classification_id);
    req.flash("notice", "Sorry, there was an error adding the vehicle to inventory.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add a Vehicle to Inventory", 
      nav,
      classificationList, 
      errors: null,
    })
  }
} 

function capitalizeFirst(str) {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/* ***********************************************************************************
 *  Return Inventory by Classification As JSON
 * ******************************************************************************** */
async function getInventoryJSON (req, res, next) {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}
  
/*******************************************************************************
 * Build  Delete Inventory View
 ***************************************************************************** */

async function buildDeleteInventory(req, res, next) {
  let nav = await utilities.getNav(); 
  const inv_id = parseInt(req.params?.inv_id) || null; 
  const inventoryData = await invModel.retrieveDataById(inv_id); 
  const name = `${inventoryData[0].inv_make} ${inventoryData[0].inv_model}`; 
  console.log("Delete View inv_id: " , inv_id)
  res.render("inventory/delete-confirm", {
    title: `Delete Inventory: ${name}`,
    nav,
    inv_make : inventoryData[0].inv_make,
    inv_model : inventoryData[0].inv_model,
    inv_year : inventoryData[0].inv_year,
    inv_price : inventoryData[0].inv_price, 
    inv_id,
    classification_id : inventoryData[0].classification_id,
    errors: null,
  })
}

/* ***********************************************************************************************
 *  Delete Inventory Item
 * ******************************************************************************************** */
async function deleteVehicle(req, res, next) {
  console.log("deleteVehicle in controller")
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_price, classification_id } = req.body
  const inv_id = parseInt(req.body.inv_id)
  const updateResult = await invModel.deleteVehicle(inv_id)


  if (updateResult) {
    req.flash("notice", `The ${inv_year} ${inv_make} ${inv_model} was successfully removed from inventory.`)
    res.redirect("/inv/management")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const name = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete Inventory" + name,
    nav,
    errors: null,
    classificationList,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}

module.exports = {
  processAddClassification, buildAddClassification, getInventoryJSON, buildEditInventory, deleteVehicle,
  buildByClassificationId, buildManagement, processInventory, buildAddInventory, updateInventory, buildDeleteInventory
}
