const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");
//Route to login
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get(
  "/registration",
  utilities.handleErrors(accountController.buildRegister)
);
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

//Route to update account
router.get(
  "/update/:account_id",
  utilities.handleErrors(accountController.updateAccountView)
);

//Route to submit update account
router.post(
  "/update/:account_id",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

//Logout
router.get("/logout", utilities.handleErrors(accountController.logout))

module.exports = router;
