const utilities = require("../utilities");
const contactController = {};
const contactModel = require("../models/contact-model")

contactController.buildContactPage = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./contact/contact", {
    title: "Contact Us",
    nav,
    errors: null,
  });
};

contactController.submitMessage = async function (req, res, next) {
  let nav = utilities.getNav();
  const { contact_name, contact_email, contact_message } = req.body;

  const submitMessage = await contactModel.submitMessage(
    contact_name,
    contact_email,
    contact_message
  );

  if (submitMessage) {
    req.flash("notice", "Your message has been sent.");
    res.status(201).render("contact/contact", {
      title: "Contact Us",
      errors: null,
      nav,
    });
  } else {
    req.flash("notice", "Sorry something went wrong. Unable to send message.");
    res.status(501).render("contact/contact", {
      title: "Contact Us",
      nav,
      errors: null,
    });
  }
};

module.exports = contactController
;
