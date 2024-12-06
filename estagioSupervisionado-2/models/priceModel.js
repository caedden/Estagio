
const db = require('../config/db'); // Importe a configuração do banco de dados

const price = {
    
    getPrice: async (id) => {
        try {
            const query = 'SELECT * FROM price where productid = '+id;
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },


    createNewPriceForProduct: async (id, price) => {
        if (!id || !quantity) {
            throw new Error('id ou quantidade não foram informados.');
        }
        try {
            const query = 'INSERT INTO price (productid, price) VALUES ($1, $2) RETURNING *';
            const values = [ id, price];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    updatePrice: async(id, price) =>{
        if (!id || !quantity) {
            throw new Error('id ou quantidade não informado');
        }
        try {
            const query = 'UPDATE price SET price = $1,  WHERE productid = $2 RETURNING *';
            const values = [price, id];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

}
module.exports = price;