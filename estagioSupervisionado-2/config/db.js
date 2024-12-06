const { Pool } = require('pg');

// Configurações do banco de dados
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Estagio',
  password: "1234",
  port: 5432, // Porta padrão do PostgreSQL
});
pool.connect()
    .then(client => {
        console.log('Conectado ao banco de dados');
        client.release(); // Libera o cliente de volta para o pool
    })
    .catch(err => console.error('Erro ao conectar ao banco de dados', err));
module.exports = pool; //Exportando para usarmos posteriomente