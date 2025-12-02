const express = require('express');
const router = express.Router();
const { entregaController } = require("../controllers/entregaController");

/** 
  Rotas relacionadas aos pedidos
  @module entregaRoutes
 
  @description

  - GET /entregas -> Listar todas sa entregas 
  - POST/ entregas -> Criar uma nova entrega 
  -PUT /entregas/idPedido -> Atualizar informações da entrega
  -DELETE /entregas/idPedido -> Deletar uma entrega 
 */

router.get("/entregas", entregaController.listarEntrega);
router.delete("/entregas/:idEntrega", entregaController.deletarEntrega);

module.exports = {entregaRoutes:router};
