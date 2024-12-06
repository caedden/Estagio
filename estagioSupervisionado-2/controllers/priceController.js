const priceModel = require('../models/priceModel'); // Importe o modelo

const priceController = {
    
    getPrice: async (req, res) => {
        const id= req.params.id;
        try {
            const price = await priceModel.getPrice(id);
            res.status(200).json(stock);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter o preço do produto com o id '+id });
        }
    },

    createNewPriceForProduct: async (req, res) => {
        const { price } = req.body;
        const id= req.params.id;

        try {
            const newPriceProduct = await priceModel.createNewPriceForProduct( id, price );
            res.status(200).json(newPriceProduct);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar preço para o produto '+id });
        }
    },
    updatePrice: async (req, res) => {
        const { price} = req.body;
        const id= req.params.id;

        try {
            const updatePriceProduct = await priceModel.updatePrice( id, price);
            res.status(200).json(updatePriceProduct);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar o preço do produto com id '+id });
        }
    }
};

module.exports = priceController;