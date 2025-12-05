const express = require('express');
const app = express();
const PORT = 8081;

// Importa as rotas de clientes, pedidos e entregas
const {clienteRoutes} = require("./src/routes/clienteRoutes");
const {pedidoRoutes} = require("./src/routes/pedidoRoutes");
const {entregaRoutes} = require("./src/routes/entregaRoutes");

app.use(express.json());

// Define que todas as rotas importadas serão usadas com "/"
app.use('/', clienteRoutes);
app.use('/', pedidoRoutes);
app.use('/', entregaRoutes);

// Inicia o servidor na porta definida
app.listen(PORT, ()=>{
    console.log(`Servidor rodando em https://localhost:${PORT}`);
});
