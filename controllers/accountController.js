const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const accountController = {};
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Deliver the root account view
accountController.buildManagement = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./account/management", {
    title: "Account",
    errors: null,
    nav,
  });
};

// Deliver login view
accountController.buildLogin = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./account/login", {
    title: "Login",
    errors: null,
    nav,
  });
};

// Deliver registration view
accountController.buildRegister = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Process Registration
 * *************************************** */

accountController.registerAccount = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;
  // Hash the password before storing
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    req.status(500).render("account/register", {
      title: registrationRules,
      nav,
      errors: null,
    });
  }
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      errors: null,
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
};

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
};

/* ****************************************
 *  Deliver Update Account View
 * ************************************ */
accountController.updateAccountView = async function (req, res, next) {
  const account_id = parseInt(req.params.account_id);
  let nav = await utilities.getNav();
  res.render("./account/update", {
    title: "Update Account",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Process Account Update
 * ************************************ */
accountController.updateAccount = async function (req, res, next) {
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;
  let nav = await utilities.getNav();
  if (!account_password) {
    const updateAccountResult = await accountModel.updateAccountDetails(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );
    if (updateAccountResult) {
      //create a new token
      let currentAccount = await accountModel.getAccountById(account_id);
      if (currentAccount.account_password) {
        delete currentAccount.account_password;
      }

      let updatedAccount = {
        ...currentAccount, // keep everything from DB
        account_firstname,
        account_lastname,
        account_email,
      };

      const accessToken = jwt.sign(
        updatedAccount,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 } // or "1h"
      );

      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }

      req.flash("notice", "Sucessfully updated account.");
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Failed to update account.");
      res.status(201).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
      });
    }

    if (account_password) {
      const hashedPassword = await bcrypt.hash(account_password, 10);
      const updateAccountResult = await accountModel.updateAccountPassword(
        account_id,
        hashedPassword
      );
      if (updateAccountResult) {
        req.flash("notice", "Sucessfully updated password.");
        res.status(201).render("account/update", {
          title: "Update Account",
          nav,
          errors: null,
        });
      }
    }
  }
};

//LOGOUT
accountController.logout = async function (req,res) {
 res.clearCookie("jwt")
 if (req.session){
  req.session.destroy(() => {})
 }
 return res.redirect("/")
}
module.exports = accountController;
