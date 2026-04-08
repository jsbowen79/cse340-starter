const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* *************************************************************************************************************
 * Build Detail View
 ************************************************************************************************************* */

Util.buildProductDetail = async function (data) {
  const price = data.inv_price;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price); 
  const mileage = new Intl.NumberFormat('en-US').format(data.inv_miles); 
  
  let details;
  if (data) {
    details = `<div id="detailsWrapper">
    <img id="heroDetails" src="${data.inv_image}" alt='Image of ${data.inv_make} ${data.inv_model}  on CSE Motors'>
    <div id="details">
    <div>
    <h2>
    ${data.inv_year} ${data.inv_make} ${data.inv_model}
    </h2>
    <h3 class>Great Price! -- ${formattedPrice}</h3>
    <p>Mileage -- ${mileage}</p>
    <p>Color : ${data.inv_color}</p>
    </div>
    <p id="description">${data.inv_description}</p>
    </div>
    <a id="scheduleBtn" href="/drive/schedule/${data.inv_id}">Schedule Test Drive</a>
    </div>`
  } else {
    details = "<h2>Sorry!  The car you were looking for was just too fast!  It is long gone!</h2>"
  }
  return details;
}


/* *************************************************************************************************************
 * Constructs the Classification ID element for Add Vehicle 
 ************************************************************************************************************* */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ************************************************************************************************************
 * Middleware For Handling Errors
 *********************************************************************************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/**************************************************************************************************************
 * Middleware to check token validity
 *********************************************************************************************************** */
Util.checkJWTToken = (req, res, next) => {
  res.locals.loggedin = false; 

  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET, 
      function (err, accountData) {
        if (err) {
          res.clearCookie("jwt")
          return res.redirect("/account/login/?message=Please%20Log%20in.")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = true; 
        next()
      })
  } else {
    next()
  }
}

/*******************************************************************************************************************
 * Middleware to authorize access to privileged sites. 
 **************************************************************************************************************** */
Util.authorization = (req, res, next) => {
  if (!res.locals.loggedin) {
    return res.redirect("/account/login/?message=Please%20Log%20in"); 
  }

    if (res.locals.accountData.account_type == "Employee" || res.locals.accountData.account_type == "Admin") {
    return  next()
    } else {
    return res.redirect("/account/login/?message=You%20aren't%20authorized%20to%20use%20this%20page."); 
  } 
 return next()
}


/*******************************************************************************************************************
 * Check Login
 **************************************************************************************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
  return  next()
  } else {
      return res.redirect("/account/login/?message=Please%20log%20in.")
  }
}



module.exports = Util