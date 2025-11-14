const pool = require("../database/")

/*
* Get all classification data
*/

async function getClassifications(){
    return await pool.query("SELECCT * FROM public.classification ORDER BY classfication_name")
}

module.exports = {getClassfications}