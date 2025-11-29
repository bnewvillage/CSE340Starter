const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const invModel = require("../models/inventory-model");

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */

validate.classificationRules = () => [
  body("classification_name")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("Enter a valid classification name.")
    .custom(async (classification_name) => {
      const classificationExists = await invModel.checkExistingClassification(
        classification_name
      );
      if (classificationExists) {
        throw new Error("Classification already exists!");
      }
    }),
];

validate.inventoryRules = () => [
  body("classification_id")
    .trim()
    .notEmpty()
    .isInt()
    .withMessage("Select a classification."),
  body("inv_make")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Enter a vehicle make."),
  body("inv_model")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Enter a vehicle model."),
  body("inv_year")
    .trim()
    .notEmpty()
    .isInt({ min: 1000, max: 9999 })
    .withMessage("Enter a valid 4-digit year."),
  body("inv_description")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Enter a vehicle description."),
  body("inv_price")
    .trim()
    .notEmpty()
    .isFloat({ min: 0 })
    .withMessage("Enter a valid price (numbers only)."),
  body("inv_miles")
    .trim()
    .notEmpty()
    .isInt({ min: 0 })
    .withMessage("Enter valid miles (whole number)."),
  body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Enter a vehicle color."),
];

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/new_classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

validate.checkInventoryData = async function (req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/new_classification", {
      errors,
      title: "Add New Inventory",
      nav,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

module.exports = validate;
