const Client = require('../models/ClientModel'); // Importa o modelo que contém a lógica das consultas

const clientController = {
  getAllClients: async (req, res) => {
    const { page = 1, limit = 10, name, document, phone, email,sortBy = 'name', order = 'ASC' } = req.query;

    try {
      // Chama o método do modelo para obter os dados dos clientes
      const clients = await Client.getAllClients({
        page,
        limit,
        name,
        email,
        document,
        phone,
        sortBy,
        order
      });

      // Retorna os dados com informações sobre a paginação
      res.status(200).json({
        data: clients.data,
        total: clients.total,
        totalPages: clients.totalPages,
        page: Number(page),
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter lista de clientes.' });
    }
  },

  getClient: async (req, res) => {
    const { id } = req.params;

    try {
      const client = await Client.getClient(id);
      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }
      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter cliente.' });
    }
  },
  getClientByDocument: async (req, res) => {
    const { id } = req.params;

    try {
      const client = await Client.getClientByDocument(id);
      if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }
      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter cliente.' });
    }
  },

  createNewClient: async (req, res) => { 
    const { name, document, password, phone, address , email} = req.body;

    try {
        const newClient = await Client.createNewClient(name, document, password, phone, address, email);
        res.status(201).json(newClient);
    } catch (error) {
        console.error("Erro ao criar novo cliente:", error);  // Log para depuração
        res.status(500).json({ error: 'Erro ao criar novo cliente.', details: error.message });  // Mensagem detalhada
    }
},

  updateClient: async (req, res) => {
    const { name, document, password, phone } = req.body;
    const { id } = req.params;

    try {
      const updatedClient = await Client.updateClient(name, document, password, phone, id);
      res.status(200).json(updatedClient);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar cliente.' });
    }
  }
};

module.exports = clientController;
