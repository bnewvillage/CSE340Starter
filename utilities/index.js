const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  });
  list += "</ul>"
  return list
}

Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>"
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += "<hr />"
      grid += "<h2>"
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>"
      grid += "</h2>"
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>"
      grid += "</div>"
      grid += "</li>"
    });
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
};

//BUILD ITEM DETAILS
Util.buildInventoryItem = async function (item) {
  if (!item) {
    return '<p class="notice">Sorry, the vehicle could not be found.</p>';
  }

  let detailHTML = '<div class="inv-detail">';
  
  // LEFT SIDE
  detailHTML += `<div class="inv-detail-left">`;
  detailHTML += `<h1>${item.inv_year} ${item.inv_make} ${item.inv_model}</h1>`;
  detailHTML += `<img src="${item.inv_image}" alt="Image of ${item.inv_year} ${item.inv_make} ${item.inv_model}" />`;
  detailHTML += `</div>`;

  // RIGHT SIDE
  detailHTML += `<div class="inv-detail-text">`;
  detailHTML += `<p class="price">$${new Intl.NumberFormat("en-US").format(item.inv_price)}</p>`;
  detailHTML += `<p><strong>Description:</strong> ${item.inv_description}</p>`;
  detailHTML += `<p><strong>Color:</strong> ${item.inv_color}</p>`;
  detailHTML += `<p><strong>Miles:</strong> ${new Intl.NumberFormat("en-US").format(item.inv_miles)}</p>`;
  detailHTML += `</div>`;

  detailHTML += '</div>';
  
  return detailHTML;
};

// DROPDOWN OF CLASSIFICATIONS - CREATE
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

/*
* Middleware fod handling errors
* Wrap other function in this
* for generatl error handling
*/

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    res.locals.accountData = null;
    res.locals.loggedin = false
    next()
  }
}

/* ****************************************
* Middleware to check user permissions
**************************************** */
Util.checkUserPermissions = (req, res, next) => {
  const accountData = res.locals.accountData
  const loggedin = res.locals.loggedin
  if (!loggedin) {
    req.flash("notice","Please log in")
    return res.redirect("/account/login")
  }
  if (accountData.account_type !=="Employee" && accountData.account_type !=="Admin"){
    req.flash("notice","You do not have permission to view that page.")
    return res.redirect("/account/login")
  }
  next()
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}


Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req , res, next)).catch(next)

module.exports = Util;