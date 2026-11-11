
// Importar dependências
const express = require("express");
const router = express.Router();

const pool = require("../config/database");

// Cadastrar uma mensagem e publicar diretamente
router.post("/", async (req, res) => {
    try {
        const { nome, assunto, texto } = req.body;

        // Validar campos
        if (
            typeof nome !== "string" ||
            typeof assunto !== "string" ||
            typeof texto !== "string" ||
            !nome.trim() ||
            !assunto.trim() ||
            !texto.trim()
        ) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos."
            });
        }

        // Validar limites
        if (
            nome.trim().length > 40 ||
            assunto.trim().length > 200 ||
            texto.trim().length > 400
        ) {
            return res.status(400).json({
                mensagem: "Um dos campos ultrapassa o limite permitido."
            });
        }

        // Salvar como aprovada para publicação imediata
        const resultado = await pool.query(
            `INSERT INTO mensagens (nome, assunto, texto, status)
             VALUES ($1, $2, $3, $4)
             RETURNING id, nome, assunto, texto, status, criado_em`,
            [nome.trim(), assunto.trim(), texto.trim(), "aprovada"]
        );

        res.status(201).json({
            mensagem: "Mensagem publicada com sucesso!",
            dados: resultado.rows[0]
        });

    } catch (erro) {
        console.error("Erro ao cadastrar mensagem:", erro);

        res.status(500).json({
            mensagem: "Erro interno ao publicar mensagem."
        });
    }
});

// Consultar mensagens publicadas
router.get("/", async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT id, nome, assunto, texto, criado_em
             FROM mensagens
             WHERE status = $1
             ORDER BY criado_em ASC
             LIMIT 200`,
            ["aprovada"]
        );

        res.json(resultado.rows);

    } catch (erro) {
        console.error("Erro ao consultar mensagens:", erro);

        res.status(500).json({
            mensagem: "Erro ao consultar mensagens."
        });
    }
});

// Exportar rotas
module.exports = router;
