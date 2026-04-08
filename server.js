console.log("Server Start Test")
const utilities = require("./utilities/")
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
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")

const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const driveRoute = require("./routes/driveRoute")
const inventoryDetailsRoute = require("./routes/inventoryDetailsRoute")
const testRoute = require('./routes/testRoute')
const accountRoute = require('./routes/accountRoute')
const managementRoute = require('./routes/inventoryRoute')
const cookieParser = require('cookie-parser')

/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',    
}))

// Express Messages Middleware
app.use(require('connect-flash')())
// app.use(function(req, res, next){
//   res.locals.messages = require('express-messages')(req, res)
//   next()
// })

//Show account info after updates
app.use((req, res, next) => {
  res.locals.showAccount = req.flash("showAccount")[0] || false;
  next();
})

// Body Parser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//Login Middleware
app.use(cookieParser())

//Verify login Middleware
app.use(utilities.checkJWTToken)


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

//Sign in Route
app.use("/account", accountRoute)

//Inventory Management Route
app.use("/inv/management", managementRoute)

//Schedule Test Drive route
app.use("/drive", driveRoute)


// File Not Found Route - must be last route in list
app.use(async(req, res, next) => {
  const message = "That car was just too fast for you! You can't afford the insurance"
  let nav; 
  try {
    nav = await utilities.getNav()
  } catch (navErr) {
    console.error("Failed to build navigation: ", navErr.message); 
    nav = null; 
  }
  res.status(404).render("errors/error", {
    title: 404,
    message,
    nav 
  })
})

/* ***********************
* Express Error Handlers
* Place after all other middleware
*************************/

//500 handler
app.use(async (err, req, res, next) => {
  let nav; 
  try {
    nav = await utilities.getNav()
  } catch (navErr) {
    console.error("Failed to build navigation: ", navErr.message); 
    nav = null; 
  }

  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  const status = err.status || 500; 
  let message; 
  if(status === 404){ message = 'Oh no! There was a crash. Maybe try a different route?  ' + status}
  else if (status === 500) {
    message = "Oh no, You left skid marks on our server!   " + status
  } else {
    message = err.message || "An unexpected error occurred.";
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
