
const db = require('../config/db'); // Importe a configuração do banco de dados

const Client = {
  getAllClients: async () => {
    try {
      const query = 'SELECT * FROM client';
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  getClient: async (id) => {
    try {
      const query = 'SELECT * FROM client where id = ' + id;
      const result = await db.query(query);
      if (result.rows[0].name == null) {
        throw error;
      }
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  getClientByDocument: async (id) => {
    try {
      const query = 'SELECT * FROM client where document = ' + id;
      const result = await db.query(query);
      if (result.rows[0].name == null) {
        throw error;
      }
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  createNewClient: async (name, document, password, phone) => {
    try {
      const query = 'INSERT INTO client (name, document, password, phone) VALUES ($1, $2, $3, $4) RETURNING *';
      const values = [name, document, password, phone];
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
  updateClient: async (name, document, password, phone, id) => {
    try {

      const query = 'UPDATE client SET name = $1, document = $2, password = $3, phone = $4 WHERE id = $5 RETURNING *';
      const values = [name, document, password, phone, id];
      const result = await db.query(query, values);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Client;