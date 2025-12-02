const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/*
 * Build inventory by classification view
 */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classification_id;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    error: null,
  });
};

invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  if (inv_id == 999) {
    const error = new Error("Intentional Error");
    error.status = 500;
    return next(error);
  } else {
    const data = await invModel.getItemByInventoryId(inv_id);
    const itemDetail = await utilities.buildInventoryItem(data[0]);
    const inv_model = await data[0].inv_model;
    let nav = await utilities.getNav();
    res.render("inventory/itemDetail", {
      title: inv_model,
      nav,
      itemDetail,
      error: null,
    });
  }
};

invCont.buildVehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("inventory/vehicleManagement", {
    title: "Vehicle Management",
    nav,
    classificationList,
  });
};

/***************************
 * VIEW: ADD CLASSIFICATION *
 ****************************/

invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/new_classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/*********************
 * ADD CLASSIFICATION*
 *********************/
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const invResult = await invModel.addClassification(classification_name);
  let nav = await utilities.getNav();
  if (invResult) {
    req.flash("notice", "New classification added.");
    res.status(201).render("inventory/new_classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Unable to add new classification.");
    res.status(501).render("inventory/new_classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  }
};

/***************************
 **VIEW: ADD NEW INVENTORY****
 ****************************/
invCont.buildNewInventory = async function (req, res) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("inventory/new_inventory", {
    title: "Add New Inventory",
    nav,
    errors: null,
    classificationList,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
  });
};

/*******************************
 * ADD NEW INVENTORY TO DATABSE*
 *******************************/
invCont.addInventory = async function (req, res) {
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
  const invResult = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color
  );
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  if (invResult && invResult.rowCount > 0) {
    req.flash("notice", "New inventory added.");
    res.status(201).render("inventory/new_inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: null,
    });
  } else {
    req.flash("notice", "Unable to add new inventory.");
    res.status(501).render("inventory/new_inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: null,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getItemByInventoryId(inv_id);
  const classificationList = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit_inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/*******************************
 * UPDATE INVENTORY TO DATABSE*
 *******************************/
invCont.updateInventory = async function (req, res) {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  );
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  const itemName = `${inv_make} ${inv_model}`;
  if (updateResult && updateResult.rowCount > 0) {
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.status(201).render("inventory/edit_inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: null,
    });
  } else {
    req.flash("notice", "Unable to update inventory.");
    res.status(501).render("inventory/edit_inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors: null,
    });
  }
};

module.exports = invCont;
