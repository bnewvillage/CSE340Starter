const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/*
* Build inventory by classification view
*/
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classification_id
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification",{
        title: className + " vehicles", 
        nav,
        grid
    })
}

invCont.buildByInventoryId = async function(req, res, next){
    const inv_id = req.params.inv_id
    if (inv_id == 999) {
        const error = new Error("Intentional Error")
        error.status = 500
        return next(error);
    } else {
    const data = await invModel.getItemByInventoryId(inv_id)
    const itemDetail = await utilities.buildInventoryItem(data[0])
    const inv_model = await data[0].inv_model
    let nav = await utilities.getNav()
    res.render("./inventory/itemDetail",{
        title: inv_model,
        nav,
        itemDetail
    })
}
}

module.exports = invCont