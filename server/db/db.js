require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, API_KEY} = process.env;
const sql = neon(`postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`);

module.exports = {
    query: async (text, params) => {
      try {
        // Execute the query
        const result = await sql(text, params);
        return result; // Return the query result
      } catch (error) {
        // Handle query error
        console.error('Database query error:', error.message);
        throw error; // Rethrow the error to be handled by the calling code
      }
    },
  };