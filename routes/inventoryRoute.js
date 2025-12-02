const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");

//Route to build inventory by classification view
router.get(
  "/type/:classification_id",
  utilities.handleErrors(invController.buildByClassificationId)
);
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildByInventoryId)
);
router.get("/", utilities.handleErrors(invController.buildVehicleManagement));
//Build the new classificaiton form view
router.get(
  "/new_classification/",
  utilities.handleErrors(invController.buildNewClassification)
);

//Send the new classification form data
router.post(
  "/new_classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

//Build the add new inventory item form view
router.get(
  "/new_inventory",
  utilities.handleErrors(invController.buildNewInventory)
);

//Add new inventory item to database
router.post(
  "/new_inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
);

//Update inventory item to database
router.post(
  "/edit/:inv_id",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.deleteInventoryView)
);

//Update inventory item to database
router.post(
  "/delete/:inv_id",
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;
