const express = require('express');
const router = express.Router();
const {clienteController} = require("../controllers/clienteController");

// GET /clientes -> Listar todos os clientes
router.get("/clientes", clienteController.listarClientes);
// POST /clientes -> Criar um novo cliente
router.post("/clientes", clienteController.criarCliente);
// PUT / clientes -> Atualizar informações do cliente ja existente
router.put("/clientes/:idCliente", clienteController.atualizarCliente);
// DELETE /clientes -> Deletar cliente
router.delete("/clientes/:idCliente", clienteController.deletarCliente);

//exportará o clienteRoutes
module.exports = {clienteRoutes: router};
