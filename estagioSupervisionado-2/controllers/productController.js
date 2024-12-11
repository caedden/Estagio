const productModel = require('../models/productModel'); // Importe o modelo
const priceController = require('../controllers/priceController');
const stockController = require('../controllers/stockController');
const { getTopSellingProductsByDate } = require('../models/orderModel');

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
    getProductByCode: async (req, res) => {
        const id = req.params.id;
        try {
            const product = await productModel.getProductByCode(id);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao obter produto com o id.' + id });
        }
    },

    createNewProduct: async (req, res) => {
        const { name, ean, description, type, group, price, quantity } = req.body;
    
        // Validação dos parâmetros
        if (!name || !ean || !description || price === undefined || quantity === undefined || !type || !group) {
            return res.status(400).json({ error: 'Name, EAN, description, price, quantity, type, and group are required' });
        }
    
        try {
            // Verifica se já existe um produto com o mesmo código EAN
            const existingProduct = await productModel.getProductByCode(ean);
            
            if (existingProduct) {
                return res.status(400).json({ error: 'Produto com este EAN já registrado.' });
            }
    
            // Cria o novo produto caso o EAN não seja duplicado
            const newProduct = await productModel.createNewProduct(name, ean, description, type, group, price, quantity);
    
            // Retorna o produto criado com status 201 (Created)
            res.status(201).json(newProduct);
        } catch (error) {
            // Log do erro para facilitar a depuração
            console.error(error);
            // Retorna erro detalhado
            res.status(500).json({ error: error.message || 'Erro ao criar novo produto.' });
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
    },
    getTopSellingProductsByDate: async (req, res) => {
    const { date } = req.params;
    try {
        const products = await productController.getTopSellingProductsByDate(date);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter produtos mais vendidos', error });
    }
}

};

module.exports = productController;