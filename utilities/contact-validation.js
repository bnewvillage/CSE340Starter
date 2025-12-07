const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

validate.contactMessageRules = () => {
  return [body("contact_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required"),
    body("contact_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide your name."),
    body("contact_message")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Enter your message.")];
};

validate.checkContactData = async (req, res, next) => {
  const { contact_name, contact_email, contact_message } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("contact/contact", {
      errors,
      title: "Contact Us",
      nav,
      contact_name,
      contact_email,
      contact_message,
    });
    return;
  }
  next();
};

module.exports = validate;
