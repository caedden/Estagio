const InactiveTableModel = require('../models/InactiveTableModel'); // Importe o modelo

const inactiveTableController = {
  getAllTables: async (req, res) => {
    try {
      const tables = await InactiveTableModel.getAllTables();
      res.status(200).json(tables);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter lista de tabelas.' });
    }
  },
  getTable: async (req, res) => {
    const id = req.params.id;
    try {
        const table = await InactiveTableModel.getTable(id);
        res.status(200).json(table);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter mesa com id ' + id });
    }
},


  createNewInactiveTable: async (req, res) => {
    const { status, identifier } = req.body;
    try {
      const newTable = await InactiveTableModel.createNewInactiveTable(status, identifier );
      res.status(201).json(newTable);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar nova mesa.' });
    }
  },
updateInativeTable: async (req, res) => {
    const {status } = req.body;
    const id  = req.params.id;

    try {

      const attTable = await InactiveTableModel.updateClient(status, id);
      res.status(201).json(attTable);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar a mesa com id .' + id });
    }
  }
};

module.exports = inactiveTableController;