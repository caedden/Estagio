const express = require('express');
const db = require('./config/db');
const clientController = require('./controllers/clientController');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
const productController = require('./controllers/productController');
const priceController = require('./controllers/priceController');
const stockController = require('./controllers/stockController');
const orderController = require('./controllers/orderController');
const inactiveTable = require('./controllers/inactiveTableController');


app.get('/api/preco/:id', priceController.getPrice);
app.get('/api/estoque/:id', stockController.getStock);


app.get('/api/clientes', clientController.getAllClients);
app.get('/api/cliente/:id', clientController.getClient);
app.get('/api/cliente/documento/:id', clientController.getClientByDocument);
app.post('/api/clientes', clientController.createNewClient);
app.put('/api/cliente/:id', clientController.updateClient);

app.get('/api/produtos', productController.getAllProducts);
app.get('/api/produto/:id', productController.getProduct);
app.get('/api/produto/codigo/:id', productController.getProductByCode);
app.get('/api/produto/topselling/:date',productController.getTopSellingProductsByDate);
app.put('/api/produto/:id', productController.updateProduct);
app.post('/api/produto', productController.createNewProduct);
app.get('/api/produto/descricao/:id', productController.getAllProductsByDescription);

app.get('/api/pedidos', orderController.getAllOrders);
app.get('/api/pedido/:id', orderController.getOrder);
app.get('/api/pedidos/tipoPagamento', orderController.getOrdersByPaymentType);
app.get('/api/pedidos/tipoPagamento&data', orderController.getPaymentReportByDateRange);
app.post('/api/pedido', orderController.createNewOrder);
app.put('/api/pedido/:id', orderController.updateOrder);

app.get('/api/mesas',inactiveTable.getAllTables);
app.get('/api/mesa/:id', inactiveTable.getTable);
app.post('/api/mesa', inactiveTable.createNewInactiveTable);
app.put('/api/mesa', inactiveTable.updateInativeTable)



app.listen(PORT, () => {
    console.log(`Servidor na porta ${PORT}`);
});