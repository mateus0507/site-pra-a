// Importar dependências
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/database");
const mensagensRoutes = require("./routes/mensagens");

// Inicializar aplicação
const app = express();

// Configurações
app.use(cors());
app.use(express.json());

// Registrar rotas
app.use("/api/mensagens", mensagensRoutes);

// Rota inicial
app.get("/", (req, res) => {
    res.json({ mensagem: "API do PANA Projetos funcionando!" });
});

// Rota de status
app.get("/api/status", (req, res) => {
    res.json({ status: "online", projeto: "PANA Projetos" });
});

// Testar banco de dados
app.get("/api/db-status", async (req, res) => {
    try {
        const resultado = await pool.query("SELECT NOW()");
        res.json({
            status: "conectado",
            banco: "PostgreSQL",
            horario: resultado.rows[0].now
        });
    } catch (erro) {
        console.error("Erro ao conectar ao banco:", erro);
        res.status(500).json({
            status: "erro",
            mensagem: "Não foi possível conectar ao banco de dados."
        });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
