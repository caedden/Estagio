const bcrypt = require('bcrypt');
const db = require('../config/db'); // Importa a configuração do banco de dados

const Client = {
  // Função para obter todos os clientes com filtros, paginação e ordenação
  getAllClients: async ({ page = 1, limit = 10, name = '', document = '', phone = '', sortBy = 'name', order = 'ASC' }) => {
    const offset = (page - 1) * limit; // Calcular o deslocamento para paginação
    const filters = [];
    const values = [];

    // Filtros dinamicamente aplicados
    if (name) {
      filters.push(`name ILIKE $${filters.length + 1}`);
      values.push(`%${name}%`);
    }
    if (document) {
      filters.push(`document ILIKE $${filters.length + 1}`);
      values.push(`%${document}%`);
    }
    if (phone) {
      filters.push(`phone ILIKE $${filters.length + 1}`);
      values.push(`%${phone}%`);
    }

    // Valida a coluna de ordenação para evitar injeção de SQL
    const validSortByColumns = ['name', 'document', 'phone']; // Colunas permitidas para ordenação
    if (!validSortByColumns.includes(sortBy)) {
      sortBy = 'name'; // Default para "name"
    }

    // Valida a direção da ordenação (ASC ou DESC)
    const validOrderDirections = ['ASC', 'DESC'];
    if (!validOrderDirections.includes(order)) {
      order = 'ASC'; // Default para "ASC"
    }

    // Construção da consulta com filtros, ordenação e paginação
    const query = `
      SELECT id, name, document, phone, address, email FROM client 
      ${filters.length > 0 ? 'WHERE ' + filters.join(' AND ') : ''}
      ORDER BY ${sortBy} ${order}
      LIMIT $${filters.length + 1} OFFSET $${filters.length + 2}
    `;

    values.push(limit, offset); // Adicionando parâmetros de limite e deslocamento

    try {
      // Executa a consulta
      const result = await db.query(query, values);

      // Conta o total de clientes para a paginação
      const totalClients = await db.query('SELECT COUNT(*) FROM client');
      const total = totalClients.rows[0].count;

      return {
        data: result.rows,
        total,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw error; // Caso algum erro ocorra, lança o erro para ser tratado pelo controlador
    }
  },

  // Função para buscar um cliente específico pelo ID
  getClient: async (id) => {
    const query = 'SELECT id, name, document, phone, address, email FROM client WHERE id = $1';
    const values = [id];

    try {
      const result = await db.query(query, values);
      return result.rows[0]; // Retorna o cliente encontrado ou undefined caso não exista
    } catch (error) {
      throw error; // Caso algum erro ocorra, lança o erro para ser tratado pelo controlador
    }
  },
  getClientByDocument: async (document) => {
    const query = 'SELECT id, name, document, phone, address, email FROM client WHERE document = $1';
    const values = [document];

    try {
      const result = await db.query(query, values);
      return result.rows[0]; // Retorna o cliente encontrado ou undefined caso não exista
    } catch (error) {
      throw error; // Caso algum erro ocorra, lança o erro para ser tratado pelo controlador
    }
  },

  // Função para criar um novo cliente (com senha criptografada)
  createNewClient: async (name, document, password, phone, address, email) => {
    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO client (name, document, password, phone, address, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, document, phone, email';
    const values = [name, document, hashedPassword, phone, address, email];

    try {
        const result = await db.query(query, values);
        return result.rows[0]; // Retorna o novo cliente criado
    } catch (error) {
        throw error;  // O erro será propagado para o controller
    }
},


  // Função para atualizar um cliente (com senha criptografada)
  updateClient: async (name, document, password, phone, id) => {
    let query = 'UPDATE client SET name = $1, document = $2, phone = $3 WHERE id = $4 RETURNING id, name, document, phone';
    const values = [name, document, phone, id];

    // Se a senha for fornecida, criptografá-la antes de salvar
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = 'UPDATE client SET name = $1, document = $2, password = $3, phone = $4 WHERE id = $5 RETURNING id, name, document, phone';
      values.push(hashedPassword);
    }

    try {
      const result = await db.query(query, values);
      return result.rows[0]; // Retorna o cliente atualizado
    } catch (error) {
      throw error;
    }
  }
};

module.exports = Client;
