
const db = require('../config/db'); // Importe a configuração do banco de dados

const Order = {
    getAllOrders: async () => {
        try {
            const query = 'SELECT * FROM orders';
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    getOrder: async (id) => {
        try {
            const query = 'SELECT * FROM orders where orderid = ' + id;
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    createNewOrder: async (items, totalOrder, paymentType, status, tableId, clientId) => {
        if (!items || !totalOrder || !paymentType || items.length === 0) {
            throw new Error('Todos os campos são obrigatórios: items, totalOrder, paymentType, status e tableId.');
        }

        const creationDate = new Date();  // Obtém a data atual
        const client = await db.connect();  // Abre a conexão com o banco de dados

        try {
            await client.query('BEGIN');  // Inicia a transação

            // 1. Inserir o pedido na tabela "Order"
            const orderQuery = `
                INSERT INTO "orders" (totalOrder, paymentType, status, tableId, clientId,creationDate)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING orderid`;
            const orderValues = [totalOrder, paymentType, status, tableId, clientId, creationDate];
            const orderResult = await client.query(orderQuery, orderValues);
            const orderId = orderResult.rows[0].orderid;  // ID do novo pedido criado

            if (!orderId) {
                throw new Error('Falha ao gerar orderId para o pedido.');
            }

            // 2. Inserir os itens do pedido na tabela "itensPedido"
            for (const item of items) {
                const itemQuery = `
                    INSERT INTO itensPedido (orderId, productId, quantity)
                    VALUES ($1, $2, $3)`;
                const itemValues = [orderId, item.id, item.quantity];
                await client.query(itemQuery, itemValues);

                // 3. Atualizar o estoque dos produtos
                const productQuery = 'SELECT quantity FROM Stock WHERE productId = $1';
                const productResult = await client.query(productQuery, [item.id]);
                const product = productResult.rows[0];

                if (!product) {
                    throw new Error(`Produto com ID ${item.id} não encontrado no estoque.`);
                }

                const newStock = product.quantity - item.quantity;
                if (newStock < 0) {
                    throw new Error(`Estoque insuficiente para o produto com ID ${item.id}`);
                }

                // Atualizar o estoque no banco de dados
                const updateStockQuery = 'UPDATE Stock SET quantity = $1 WHERE productId = $2';
                await client.query(updateStockQuery, [newStock, item.id]);
            }

            // 4. Finalizar a transação
            await client.query('COMMIT');
            return { orderId, items, totalOrder, paymentType, status, tableId, creationDate };

        } catch (error) {
            await client.query('ROLLBACK');  // Reverte a transação em caso de erro
            throw error;
        } finally {
            client.release();  // Libera a conexão com o banco de dados
        }
    },

    

    updateOrder: async (id, status) => {
        let array = []
        if (!id || !status) {
            throw new Error('Um ou mais parametros informados esta incorreto');
        }
        try {
            const query = 'UPDATE orders SET status = $1 WHERE orderid = $2 RETURNING *';
            const values = [status, id];
            const client = await db.connect();
        
            try {
                await client.query('BEGIN');  // Inicia a transação
        
                if (status === "cancelado") {
                    const queryItens = 'SELECT * FROM itenspedido WHERE orderid = $1';
                    const resultItens = await client.query(queryItens, [id]);
        
                    for (const item of resultItens.rows) {
                        // Atualizar o estoque dos produtos
                        const productQuery = 'SELECT quantity FROM Stock WHERE productId = $1';
                        const productResult = await client.query(productQuery, [item.productid]);
                        const product = productResult.rows[0];
        
                        if (!product) {
                            throw new Error(`Produto com ID ${item.productid} não encontrado no estoque.`);
                        }
        
                        const newStock = product.quantity + item.quantity;
        
                        // Atualizar o estoque no banco de dados
                        const updateStockQuery = 'UPDATE Stock SET quantity = $1 WHERE productId = $2';
                        await client.query(updateStockQuery, [newStock, item.productid]);
                    }
                }
        
                const result = await client.query(query, values);
                await client.query('COMMIT');  // Finaliza a transação
                return result.rows[0];
            } catch (error) {
                await client.query('ROLLBACK');  // Reverte a transação em caso de erro
                throw error;
            } finally {
                client.release();  // Libera a conexão com o banco de dados
            }
        } catch (error) {
            throw error;
        }
        
    },
    getOrdersByPaymentType: async () => {
        try {
            // Consulta SQL para contar os pedidos por tipo de pagamento
            const query = `
                SELECT orderId, totalorder,paymenttype, COUNT(*) as total_orders
                FROM public.orders
                GROUP BY paymenttype
                ORDER BY totalorders DESC;
            `;
            const result = await db.query(query);

            // Verifica se há resultados e retorna o formato adequado
            if (result.rows.length === 0) {
                return { message: 'Nenhum pedido encontrado.', paymentReport: {} };
            }

            // Retorna o relatório com os dados encontrados
            return {
                message: 'Relatório de pedidos por tipo de pagamento',
                paymentReport: result.rows.reduce((acc, row) => {
                    // Cria um objeto com o tipo de pagamento como chave e a quantidade de pedidos como valor
                    acc[row.paymenttype] = row.total_orders;
                    return acc;
                }, {})
            };
        } catch (error) {
            throw new Error('Erro ao gerar relatório de pedidos por tipo de pagamento: ' + error.message);
        }
    },
    getPaymentReportByDateRange: async (startDate, endDate) => {
        try {
            const query = `
                SELECT paymenttype, COUNT(*) AS total_orders
                FROM orders
                WHERE creationdate BETWEEN $1 AND $2
                GROUP BY paymenttype;
            `;
            const values = [startDate, endDate];
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

}
module.exports = Order;