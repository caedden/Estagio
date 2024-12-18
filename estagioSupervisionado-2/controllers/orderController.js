const orderModel = require('../models/orderModel'); // Importe o modelo

const orderController = {
    getAllOrders: async (req, res) => {
        try {
            const orders = await orderModel.getAllOrders();
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter lista de pedidos.' });
        }
    },

    getOrder: async (req, res) => {
        const id = req.params.id;
        try {
            const order = await orderModel.getOrder(id);
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter pedido com o id ' + id });
        }
    },


     createNewOrder :async (req, res) => {
        const { items, totalOrder, paymentType, status, tableId, clientId } = req.body;
    
        // Verificar se os dados necessários foram fornecidos
        if (!items || !totalOrder || !paymentType || !status || !tableId) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios: items, totalOrder, paymentType, status e tableId.' });
        }
    
        try {
            // Chama a função para criar o pedido e inserir os itens no banco de dados
            const newOrder = await orderModel.createNewOrder(items, totalOrder, paymentType, status, tableId, clientId);
    
            // Retorna o pedido criado como resposta
            res.status(201).json({
                message: `Pedido criado com sucesso! ID = ${newOrder.orderId}`,
                order: newOrder,
            });
        } catch (error) {
            console.error('Erro ao criar o pedido:', error);
            res.status(500).json({ error: 'Erro ao criar o novo pedido.' });
        }
    },
    
   
    

    updateOrder: async (req, res) => {
        const { status } = req.body;
        const id = req.params.id;

        try {
            const updateOrder = await orderModel.updateOrder(id, status);
            res.status(200).json(updateOrder);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar o pedido com id ' + id });
        }
    },
    getOrdersByPaymentType: async (req, res) => {
        try {
            const report = await orderModel.getOrdersByPaymentType();

            // Retorna o relatório de pedidos por tipo de pagamento
            res.status(200).json(report);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao gerar relatório de pedidos por tipo de pagamento.' });
        }
    },
    getPaymentReportByDateRange: async (req, res) => {
        const { startDate, endDate } = req.query;

        // Verificar se as datas foram fornecidas
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'As datas de início e fim são obrigatórias.' });
        }

        try {
            // Buscar o relatório de pagamento por tipo dentro do intervalo de datas
            const report = await orderModel.getPaymentReportByDateRange(startDate, endDate);
            res.status(200).json({
                message: 'Relatório de pedidos por tipo de pagamento',
                paymentReport: report
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao gerar relatório de pedidos por tipo de pagamento.' });
        }
    }
};

module.exports = orderController;