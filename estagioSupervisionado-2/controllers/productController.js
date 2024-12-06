const productModel = require('../models/productModel'); // Importe o modelo
const priceController = require('../controllers/priceController');
const stockController = require('../controllers/stockController')

const productController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await productModel.getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter lista de produtos.' });
        }
    },
    getAllProductsByDescription: async (req, res) => {
        const id = req.params.id;
        try {
            const products = await productModel.getAllProductsByDescription(id);
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter lista de produtos por descrição.' });
        }
    },

    getProduct: async (req, res) => {
        const id = req.params.id;
        try {
            const product = await productModel.getProduct(id);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter produto com o id.' + id });
        }
    },

    createNewProduct: async (req, res) => {
        const { name, ean, description, price, quantity } = req.body;
        try {
            const newProduct = await productModel.createNewProduct(name, ean, description, price, quantity);
            res.status(200).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar novo produto.' });
        }
    },
    updateProduct: async (req, res) => {
        const { name, ean, description } = req.body;
        const id = req.params.id;

        try {
            const attProduct = await productModel.updateProduct(name, ean, description, id);
            res.status(200).json(attProduct);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar o produto com id ' + id });
        }
    }
};

module.exports = productController;