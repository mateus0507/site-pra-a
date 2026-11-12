// Conexão com o PostgreSQL
// Aceita DATABASE_URL (padrão da maioria das hospedagens) ou as variáveis separadas DB_*
const { Pool } = require("pg");

const conexao = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    };

const pool = new Pool({
    ...conexao,
    // Bancos hospedados costumam exigir SSL: use DB_SSL=true
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

pool.on("error", (erro) => {
    console.error("Erro inesperado no banco:", erro.message);
});

module.exports = pool;
