const ClientModel = require('../models/ClientModel'); // Importe o modelo

const clientController = {
  getAllClients: async (req, res) => {
    try {
      const clients = await ClientModel.getAllClients();
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter lista de clientes.' });
    }
  },
  getClient: async (req, res) => {
    const id = req.params.id;
    try {
        const client = await ClientModel.getClient(id);
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter cliente com id ' + id });
    }
},
getClientByDocument: async (req, res) => {
  const id = req.params.id;
  try {
      const client = await ClientModel.getClientByDocument(id);
      res.status(200).json(client);
  } catch (error) {
      res.status(500).json({ error: 'Erro ao obter cliente com o documento' + id });
  }
},


  createNewClient: async (req, res) => {
    const { name, document, password, phone } = req.body;
    try {
      const newClient = await ClientModel.createNewClient(name, document, password, phone);
      res.status(201).json(newClient);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar novo cliente.' });
    }
  },
  updateClient: async (req, res) => {
    const { name, document, password, phone } = req.body;
    const id  = req.params.id;

    try {

      const attClient = await ClientModel.updateClient(name, document, password, phone, id);
      res.status(201).json(attClient);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar o cliente com id .' + id });
    }
  }
};

module.exports = clientController;