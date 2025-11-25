const express = require('express');
const router = express.Router();
const { pedidoController } = require("../controllers/pedidoController");

/**
 * Define as rotas relacionadas aos pedidos
 * 
 * @module pedidoRoutes
 * 
 * @description
 * -GET /pedidos -> lista todos os pedidos do banco de dados.
 * -POST /pedidos -> cria uma novo pedido .
 * -PUT /pedidos -> Atualizar pedido.
 * -DELETE /pedidos -> Deletar um pedido.
 */
router.get("/pedidos", pedidoController.listarPedidos);
router.post("/pedidos", pedidoController.criarPedido);
router.put("/pedidos/:idPedido", pedidoController.atualizaPedido);
router.delete("/pedidos/:idPedido", pedidoController.deletarPedido);

module.exports = {pedidoRoutes: router};