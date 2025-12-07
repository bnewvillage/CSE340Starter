const express = require("express");
const router = new express.Router();
const contactController = require("../controllers/contactController");
const utilities = require("../utilities");
const contactValidate = require("../utilities/contact-validation");

router.get("/", utilities.handleErrors(contactController.buildContactPage));
router.post(
  "/",
  contactValidate.contactMessageRules(),
  contactValidate.checkContactData,
  utilities.handleErrors(contactController.submitMessage)
);

module.exports = router;