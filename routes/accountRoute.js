const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")
//Route to login
router.get("/", utilities.handleErrors(accountController.buildManagement)) //unmade controller
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/registration", utilities.handleErrors(accountController.buildRegister))
router.post("/register", regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)



module.exports = router;