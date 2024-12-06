
const db = require('../config/db'); // Importe a configuração do banco de dados

const Product = {
    getAllProducts: async () => {
        try {
            const query = `SELECT p.id, p.name, p.ean, p.description, price.price, stock.quantity FROM product AS p INNER JOIN price ON price.productid = p.id INNER JOIN stock ON stock.productid = p.id`;
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },
    getAllProductsByDescription: async (id) => {
        try {
            const query = 'SELECT * FROM product WHERE description = $1'; // Usando parâmetro
            const result = await db.query(query, [id]); // Passando o parâmetro como um array
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    getProduct: async (id) => {
        try {
            const query = 'SELECT * FROM product where id = $1';
            const result = await db.query(query, [id]); // Passando o parâmetro como um array
            return result.rows;
        } catch (error) {
            throw error;
        }
    },


    createNewProduct: async (name, ean, description, price, quantity) => {
        if (!name || !ean || !description || price === undefined || quantity === undefined) {
            throw new Error('Name, EAN, description, price, and quantity are required');
        }

        const creationdate = new Date(); // Obtém a data atual

        const client = await db.connect(); // Conectando ao banco de dados

        try {
            await client.query('BEGIN'); // Iniciando a transação

            // Inserindo o novo produto
            const productQuery = 'INSERT INTO product (name, ean, description, creationdate) VALUES ($1, $2, $3, $4) RETURNING *';
            const productValues = [name, ean, description, creationdate];
            const productResult = await client.query(productQuery, productValues);
            const newProduct = productResult.rows[0];

            // Inserindo dados na tabela price
            const priceQuery = 'INSERT INTO price (productid, price) VALUES ($1, $2)';
            const priceValues = [newProduct.id, price]; // Usando newProduct.id para referenciar o ID do produto
            await client.query(priceQuery, priceValues);

            // Inserindo dados na tabela stock
            const stockQuery = 'INSERT INTO stock (productid, quantity) VALUES ($1, $2)';
            const stockValues = [newProduct.id, quantity]; // Usando newProduct.id
            await client.query(stockQuery, stockValues);

            await client.query('COMMIT'); // Confirmando a transação
            return newProduct;
        } catch (error) {
            await client.query('ROLLBACK'); // Revertendo a transação em caso de erro
            throw error;
        } finally {
            client.release(); // Liberando a conexão
        }
    },


    updateProduct: async (name, ean, description, id) => {
        if (!name || !ean || !description) {
            throw new Error('Name, EAN, and description are required');
        }
        try {
            const query = 'UPDATE product SET name = $1, ean = $2, description = $3 WHERE id = $4 RETURNING *';
            const values = [name, ean, description, id];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

}
module.exports = Product;