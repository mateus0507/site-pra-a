
// Importar dependências
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Inicializar aplicação
const app = express();

// Configurações
app.use(cors());
app.use(express.json());

// Rota inicial
app.get("/", (req, res) => {
    res.json({
        mensagem: "API do PANA Projetos funcionando!"
    });
});

// Rota de teste
app.get("/api/status", (req, res) => {
    res.json({
        status: "online",
        projeto: "PANA Projetos"
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
