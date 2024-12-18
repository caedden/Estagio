const stockModel = require('../models/stockModel'); // Importe o modelo

const stockController = {
    
    getStock: async (req, res) => {
        const id= req.params.id;
        try {
            const stock = await stockModel.getStock(id);
            res.status(200).json(stock);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter o estoque do produto com o id.'+id });
        }
    },

    createNewStockProduct: async (req, res) => {
        const { quantity } = req.body;
        const id= req.params.id;

        try {
            const newProductStock = await stockModel.createNewStockProduct( id, quantity );
            res.status(200).json(newProductStock);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar estoque para o produto '+id });
        }
    },
    updateStock: async (req, res) => {
        const { quantity} = req.body;
        const id= req.params.id;

        try {
            const attProductStock = await stockModel.updateStock( id, quantity);
            res.status(200).json(attProductStock);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar o estoque do produto com id '+id });
        }
    }
};

module.exports = stockController;