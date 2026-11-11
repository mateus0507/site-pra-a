
// Importar o PostgreSQL
const { Pool } = require("pg");

// Criar conexão com o banco
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Exportar conexão
module.exports = pool;
