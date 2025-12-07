const pool = require("../database/");

async function submitMessage(
    contact_name,
    contact_email,
    contact_message,
) {
    try {
        const sql = "INSERT INTO contact (contact_name, contact_email, contact_message) VALUES ($1, $2, $3) RETURNING *";
        return await pool.query(sql, [
            contact_name,
            contact_email,
            contact_message,
        ])
    } catch (error) {
        return error.message;
    }
}

module.exports = {submitMessage}