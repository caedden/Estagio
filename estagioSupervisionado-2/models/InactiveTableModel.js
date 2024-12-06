
const db = require('../config/db'); // Importe a configuração do banco de dados

const InactiveTable = {
    getAllTables: async () => {
        try {
            const query = 'SELECT * FROM inactiveTable';
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },
  

    getInactiveTable: async (id) => {
        try {
            const query = 'SELECT * FROM inactiveTable where id = $1' ;
            const result = await db.query(query, [id]); // Passando o parâmetro como um array
            return result.rows;
        } catch (error) {
            throw error;
        }
    },


    createNewInactiveTable : async (status, identifier) => {
        try {
          const query = 'INSERT INTO inactiveTable (status, identifier) VALUES ($1, $2) RETURNING *';
          const values = [status, identifier];
          const result = await db.query(query, values);
          return result.rows[0];
        } catch (error) {
          throw error;
        }
      },
    

    updateInativeTable: async (status, id) => {
        if (!status || !id ) {
            throw new Error('status e id sao necessarios');
        }
        try {
            const query = 'UPDATE inativeTable SET status = $1 WHERE id = $2 RETURNING *';
            const values = [status, id];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

}
module.exports = InactiveTable;