const express = require('express');
const router = express.Router();
const { pedidoController } = require("../controllers/pedidoController");

/**
 * Define as rotas relacionadas aos pedidos
 * 
 * @module pedidoRoutes
 * 
 * @description
 * - GET /pedidos -> Lista todos os pedidos e suas informações.
 * - POST /pedidos -> cria uma novo pedido.
 * - PUT /pedidos -> Atualizar informações do pedido.
 *  -DELETE /pedidos -> Deleta pedido identificado pelo ID.
 */
router.get("/pedidos", pedidoController.listarPedidos);
router.post("/pedidos", pedidoController.criarPedido);
router.put("/pedidos/:idPedido", pedidoController.atualizaPedido);
router.delete("/pedidos/:idPedido", pedidoController.deletarPedido);

module.exports = {pedidoRoutes: router};