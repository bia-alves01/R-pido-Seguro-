const {pedidoModel} = require("../models/pedidoModel");
const {clienteModel} = require("../models/clienteModel");

const pedidoController = {
    /**
     * Controlador que lista todos os pedidos do banco de dados.
     * 
     * @async
     * @function listarPedidos
     * @param {object} req - Objeto da requisição (recebido do cliente HTTP)
     * @param {object} res - Objeto da resposta (enviado ao cliente HTTP)
     * @returns {Promise<void} Retorna uma resposta JSON com a lista de pedidos.
     * @throws Mostra no console e retorna erro 500  se ocorrer falha ao buscar os pedidos.
     */
    listarPedidos: async (req, res) => {
        try {
            const pedidos = await pedidoModel.buscarTodos();

            res.status(200).json(pedidos);
        } catch (error) {
            console.error(`Erro ao listar pedido:`, error);
            res.status(500).json({Erro: "Erro interno no servidor ao listar pedido!"});
        }
    },

    criarPedido: async (req, res) => {
      try {
        const {idCliente, dataPedido, tipoEntrega, distancia, pesoCarga, valorKm, valorKg } = req.body;

        if (idCliente == undefined || dataPedido == undefined || statusPagamento == undefined || tipoEntrega == undefined || distancia == undefined || pesoCarga == undefined || valorKm == undefined || valorKg == undefined ) {
            return res.status(400).json({Erro: "Campos obrigatórios não preenchidos!"});
        }

        if (idCliente.length != 36) {
            return res.status(400).json({Erro: "Id do Cliente inválido!"});
        }

        const cliente = await clienteModel.buscarUm(idCliente);

        if (!cliente || cliente.length != 1) {
            return res.status(404).json({Erro: "Cliente não encontrado!"});
        }

        await pedidoModel.inserirPedido(idCliente, dataPedido, tipoEntrega, distancia, pesoCarga, valorKm, valorKg);

        res.status(201).json({message: "Pedido cadastrado com sucesso!"});

      } catch (error) {
        console.error(`Erro ao cadastrar pedido!`, error);
        res.status(500).json({Erro: "Erro interno no servidor ao cadastrar pedido!"});
      }  
    },

    atualizaPedido: async (req, res) => {
        try {
            const {idPedido} = req.params;
            const {idCliente, dataPedido, tipoEntrega, distancia, pesoCarga, valorKm, valorKg} = req.body;

            if (idPedido.length != 36) {
                return res.status(400).json({erro: "id do pedido inválido!"});
            }

            const pedido = await pedidoModel.buscarUm(idPedido);

            if (!pedido || pedido.length !== 1) {
                return res.status(401).json({erro: "Pedido não enontrado!"});
            }

            if (idCliente) {
                
                if (idCliente.length != 36) {
                    return res.status(400).json({erro: "id do Cliente inválido!"});
                }

                const cliente = await clienteModel.buscarUm(idCliente);

                if (!cliente || cliente.length !== 1) {
                    return res.status(401).json({erro: "Cliente não enontrado!"});
                }
            }

        const pedidoAtual = pedido[0];


        const idClienteAtualizado = idCliente ?? pedidoAtual.idCliente;
        const dataPedidoAtualizado = dataPedido ?? pedidoAtual.dataPedido;
        const tipoEntregaAtaulizado = tipoEntregaAtaulizado ?? tipoEntregaAtaulizado.tipoEntrega;
        const distanciaAtual = distanciaAtual ?? distanciaAtual.distancia;
        const pesoCargaAtual = pesoCargaAtual ?? pesoCargaAtual.pesoCargal;
        const valorKmAtual = valorKmAtual ?? valorKmAtual.valorKm;
        const valorKgAtual = valorKgAtual ?? valorKgAtual.valorKg;

        await pedidoModel.atualizarPedido(idPedido, idClienteAtualizado, dataPedidoAtualizado, distanciaAtual, pesoCargaAtual, valorKmAtual, valorKgAtual);

        res.status(200).json({mensagem: "Pedido atualizado com sucesso!"});

        } catch (error) {
            console.error(`Erro ao atualizar pedido:`, error);
            res.status(500).json({ erro: "Erro interno no servidor ao atualizar pedido!"});
        }
    },

    deletarPedido: async (req, res) => {
        try {
            const {idPedido} = req.params;

            if (idPedido.length != 36) {
                return res.status(400).json({erro: "id do pedido inválido!"});
            }

            const pedido = await pedidoModel.buscarUm(idPedido);

            if (!pedido || pedido.length !== 1) {
                return res.status(401).json({erro: "Pedido não enontrado!"});
            }

            await pedidoModel.deletarPedido(idPedido);
            res.status(200).json({mensagem: "Pedido deletado com sucesso!"});

        } catch (error) {
            console.error(`Erro ao deletar pedido:`, error);
            res.status(500).json(`Erro interno no servidor ao deletar pedido!`);
            throw error;
        }
    }
}


module.exports = { pedidoController };