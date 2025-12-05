const express = require('express');
const router = express.Router();
const {clienteController} = require("../controllers/clienteController");

/**
 * Rotas relacionadas a clientes
 * @module clienteRoutes
 * 
 * @description
 * - GET /clientes -> Listar todos os clientes e suas informações.
 * - POST/clientes -> Criar um novo cliente. 
 * -PUT /clientes/idClientes -> Atualizar informações do cliente.
 * -DELETE /clientes/idClientes -> Deletar um cliente identificado pelo ID.
 */
router.get("/clientes", clienteController.listarClientes);
router.post("/clientes", clienteController.criarCliente);
router.put("/clientes/:idCliente", clienteController.atualizarCliente);
router.delete("/clientes/:idCliente", clienteController.deletarCliente);

//exportará o clienteRoutes
module.exports = {clienteRoutes: router};
