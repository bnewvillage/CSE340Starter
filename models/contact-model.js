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

async function getAllMessages() {
  try {
    const sql = `
      SELECT contact_name, contact_email, contact_message
      FROM contact
      ORDER BY contact_name ASC;
    `;
    const data = await pool.query(sql);
    return data.rows;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

module.exports = { submitMessage, getAllMessages };