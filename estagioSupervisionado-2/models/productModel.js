
const db = require('../config/db'); // Importe a configuração do banco de dados

const Product = {
    getAllProducts: async () => {
        try {
            const query = `SELECT p.id, p.name, p.ean, p.description, p.group, p.type,price.price, stock.quantity FROM product AS p INNER JOIN price ON price.productid = p.id INNER JOIN stock ON stock.productid = p.id`;
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },


    getAllProductsByDescription: async (description) => {
        try {
            const query = `
                    SELECT p.id, p.name, p.ean, p.description, p.group, p.type, price.price, stock.quantity 
                    FROM product AS p
                    INNER JOIN price ON price.productid = p.id
                    INNER JOIN stock ON stock.productid = p.id
                    WHERE p.description ILIKE $1 OR p.name ILIKE $1;
                `;
            const result = await db.query(query, [`%${description}%`]); // Usando ILIKE para busca case-insensitive
            return result.rows;
        } catch (error) {
            throw error;
        }
    },


    getProduct: async (id) => {
        try {
            const query = 'SELECT p.id, p.name, p.ean, p.description, p.group, p.type,price.price, stock.quantity FROM product AS p INNER JOIN price ON price.productid = p.id INNER JOIN stock ON stock.productid = p.id where p.id = $1';
            const result = await db.query(query, [id]); // Passando o parâmetro como um array
            return result.rows;
        } catch (error) {
            throw error;
        }
    },
    getProductByCode: async (EAN) => {
        try {
            const query = `
                            SELECT p.id, p.name, p.ean, p.description, p.group, p.type, price.price, stock.quantity 
                            FROM product AS p
                            INNER JOIN price ON price.productid = p.id
                            INNER JOIN stock ON stock.productid = p.id
                            WHERE p.EAN = $1;
                         `;
            const result = await db.query(query, [EAN]); // Passando o parâmetro como um array
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    getTopSellingProductsByDate: async (date) => {
        try {
            const query = `
                    SELECT p.id, p.name, p.ean, p.description, p.group, p.type, price.price, SUM(ip.quantity) AS total_quantity
                    FROM product AS p
                    INNER JOIN price ON price.productid = p.id
                    INNER JOIN itensPedido AS ip ON ip.productid = p.id
                    INNER JOIN orders AS o ON o.orderid = ip.orderid
                    WHERE DATE(o.creationdate) = "$1"
                    GROUP BY p.id, p.name, p.ean, p.description, p.group, p.type, price.price
                    ORDER BY total_quantity DESC;
                `;
            const result = await db.query(query, [date]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    createNewProduct: async (name, ean, description, type, group, price, quantity) => {
        if (!name || !ean || !description || price === undefined || quantity === undefined || !type || !group) {
            throw new Error('Name, EAN, description, price, quantity, type, and group are required');
        }

        // Validando se price e quantity são números válidos
        if (isNaN(price) || isNaN(quantity)) {
            throw new Error('Price and quantity must be valid numbers');
        }

        const creationdate = new Date(); // Obtém a data atual
        const client = await db.connect(); // Conectando ao banco de dados

        try {
            await client.query('BEGIN'); // Iniciando a transação

            // Inserindo o novo produto
            const productQuery = 'INSERT INTO product (name, ean, description, type, "group", creationdate) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
            const productValues = [name, ean, description, type, group, creationdate];
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
            console.error('Error during product creation:', error);
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