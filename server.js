const utilities = require("./utilities/index.js")
/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute.js")
const inventoryDetailsRoute = require("./routes/inventoryDetailsRoute.js")
const testRoute = require('./routes/testRoute.js')

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


//Debugging
app.use((req, res, next) => {
  console.log("INCOMING REQUEST:", req.method, req.url);
  next();
});


/* ***********************
 * Routes
 *************************/
app.use(static)

// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))

//Inventory Route
app.use("/inv", inventoryRoute)

//Inventory Detail Route
app.use("/inv/detail", inventoryDetailsRoute)

//Error Test Route
app.use("/test", testRoute)

// File Not Found Route - must be last route in list
app.use((req, res, next) => {
  const message = "That car was just too fast for you! You can't afford the insurance"
  res.status(404).render("errors/error", {
    title: 404,
    message,
    nav: null 
  })
})

/* ***********************
* Express Error Handlers
* Place after all other middleware
*************************/

//500 handler
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  const status = err.status || 500; 
  let message; 
  if(status === 404){ message = 'Oh no! There was a crash. Maybe try a different route?  ' + status}
  else if (status === 500) {
    message = "Oh no, You left skid marks on our server!   " + status
  }
  res.status(status)
  res.render("errors/error", {
    title: status === 500 ? 'Server Error' : status,
    message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
