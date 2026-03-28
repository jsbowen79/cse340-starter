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
 * Build Management View
 ***************************************************************************** */

async function buildManagement (req, res, next) {
  let nav = await utilities.getNav(); 
  let selectList = await utilities.buildClassificationList(); 
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
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
  let {inv_make, inv_model, inv_description, inv_color} = req.body
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
  

module.exports = {
  processAddClassification, buildAddClassification,
  buildByClassificationId, buildManagement, processInventory, buildAddInventory 
}
