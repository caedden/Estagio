
const db = require('../config/db'); // Importe a configuração do banco de dados

const stock = {
    
    getStock: async (id) => {
        try {
            const query = 'SELECT * FROM stock where productid = '+id;
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },


    createNewStockProduct: async (id, quantity) => {
        if (!id || !quantity) {
            throw new Error('id ou quantidade não foram informados.');
        }
        try {
            const query = 'INSERT INTO stock (productid, quantity) VALUES ($1, $2) RETURNING *';
            const values = [ id, quantity];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    updateStock: async(id, quantity) =>{
        if (!id || !quantity) {
            throw new Error('id ou quantidade não informado');
        }
        try {
            const query = 'UPDATE stock SET quantity = $1,  WHERE productid = $2 RETURNING *';
            const values = [quantity, id];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

}
module.exports = stock;