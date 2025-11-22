const utilities = require("../utilities/")
const accountModel = require("../models/account-model/")
const accountController = {}

// Deliver login view
accountController.buildLogin = async function(req, res){
  let nav = await utilities.getNav()
  res.render("./account/login",{
    title: "Login",
    nav,
  })
}

// Deliver registration view
accountController.buildRegister = async function(req, res,next){
    let nav = await utilities.getNav()
    res.render("./account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */



module.exports = accountController