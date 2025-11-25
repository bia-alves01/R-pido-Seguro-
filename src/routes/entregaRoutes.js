const express = require('express');
const router = express.Router();
const { entregaController } = require("../controllers/entregaController");

/** 
  Rotas relacionadas aos pedidos
  @module entregaRoutes
 
  @description

  - GET /entregas -> Listar todas sa entregas 
  - POST/ entregas -> Criar uma nova entrega 
  -DELETE /entregas -> Deletar uma entrega 
 */

router.get("/entregas", entregaController.listarEntregas);
router.get("/entregas/:idEntrega", entregaController.buscarEntregaPorId);
router.post("/entregas", entregaController.criarEntrega);
router.delete("/entregas/:idEntrega", entregaController.deletarEntrega);
