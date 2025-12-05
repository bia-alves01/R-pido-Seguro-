const { pedidoModel } = require("../models/pedidoModel");
const { clienteModel } = require("../models/clienteModel");
const { entregaModel } = require("../models/entregaModel");

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

            const { idPedido } = req.params;

            //Listar apenas um pedido
            if (idPedido) {
                if (idPedido.length != 36) {
                    return res.status(400).json({ erro: 'id do pedido inválido' });
                }

                let pedido = await pedidoModel.buscarUm(idPedido);
                res.status(200).json(pedido);
            }

            //Listar todos os pedidos
            const pedidos = await pedidoModel.buscarTodos();

            res.status(200).json(pedidos);

        } catch (error) {
            console.error("Erro ao listar pedido", error);
            res.status(500).json({ erro: "Erro interno no servidor ao listar pedidos" });
        }
    },

    /**
     * @async
     * @function criarPedido
     * @param {*} req - Objeto da requisição (recebido do cliente HTTP)
     * @param {*} res - Objeto da resposta (enviado ao cliente HTTP)
     * @returns {Promise<Array} {mensagem: `Pedido criado com sucesso!`}.
     * @throws Mostra no console e retorna erro 500  se ocorrer falha ao cirar o pedido.
     */
    criarPedido: async (req, res) => {
        try {
            //Criar pedido
            const { idCliente, dataPedido, tipoEntrega, distancia, pesoCarga, valorKm, valorKg, statusEntrega } = req.body;

            if (idCliente == undefined || dataPedido == undefined || tipoEntrega == undefined || distancia == undefined || pesoCarga == undefined || valorKm == undefined || valorKg == undefined) {
                return res.status(400).json({ Erro: "Campos obrigatórios não preenchidos!" });
            }

            //Verificar se id é válido
            if (idCliente.length != 36) {
                return res.status(400).json({ Erro: "Id do Cliente inválido!" });
            }

            //Buscar apenas o cliente identificado pelo id
            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length != 1) {
                return res.status(404).json({ Erro: "Cliente não encontrado!" });
            }

            // Criar entrega 

            // Valor da distância
            let valorDistancia = distancia * valorKm;

            // Valor do peso
            let valorPeso = pesoCarga * valorKg;

            // Valor base
            let valorBase = valorDistancia + valorPeso;

            // Valor final inicial
            let valorFinal = valorBase;

            // Acréscimo
            let acrescimo = 0;

            // Se entrega for "urgente", haverá acréscimo de 20%
            if (tipoEntrega.toLowerCase() === "urgente") {
                acrescimo = valorBase * 0.20;
                valorFinal = valorFinal + acrescimo;
            }

            // Desconto
            let desconto = 0;

            //  Se valor base for maior que 500, desconto de 10%
            if (valorBase > 500) {
                desconto = valorBase * 0.10;
                valorFinal = valorFinal - desconto;
            }

            // Taxa extra
            let taxaEntrega = 0;

            // Se peso da carga for maior que 50 kg, taxa extra de R$ 15,00
            if (pesoCarga > 50) {
                taxaEntrega = 15;
                valorFinal = valorFinal + taxaEntrega;
            }

            // Status da entrega
            statusEntregaDefault = "calculado";
            if (statusEntrega) {
                if (statusEntrega.toLowerCase() != "calculado" && statusEntrega.toLowerCase() != "entregue" && statusEntrega.toLowerCase() != "calculado" && statusEntrega.toLowerCase() != "em transito") {
                    return res.status(400).json({ erro: "status entrega inválido " });
                }
                statusEntregaDefault = statusEntrega;
            }

            // Inserir pedido no banco
            await pedidoModel.inserirPedido(
                idCliente,
                dataPedido,
                tipoEntrega,
                distancia,
                pesoCarga,
                valorKm,
                valorKg,
                valorDistancia,
                valorPeso,
                acrescimo,
                desconto,
                taxaEntrega,
                valorFinal,
                statusEntrega
            );

            res.status(201).json({ message: "Pedido cadastrado com sucesso!" });


        } catch (error) {
            console.error(`Erro ao cadastrar pedido!`, error);
            res.status(500).json({ Erro: "Erro interno no servidor ao cadastrar pedido!" });
        }
    },

    /**
     * @async
     * @function atualizarPedido
     * @param {*} req - Objeto da requisição (recebido do cliente HTTP)
     * @param {*} res - Objeto da resposta (enviado ao cliente HTTP)
     * @returns Retorna os dados do pedido atualizado.
     * @throws Mostra no console e retorna erro 500  se ocorrer falha ao atualizar o pedido.
     */
    atualizaPedido: async (req, res) => {
        try {
            const { idPedido } = req.params;
            const { idCliente, dataPedido, tipoEntrega, distancia, pesoCarga, valorKm, valorKg, statusEntrega } = req.body;

            //Verificaçõo do id
            if (!idPedido || idPedido.length !== 36) {
                return res.status(400).json({ erro: "ID do pedido inválido!" });
            }

            const pedido = await pedidoModel.buscarUm(idPedido);

            //Verificação se pedido existe 
            if (!pedido || pedido.length !== 1) {
                return res.status(404).json({ erro: "Pedido não encontrado!" });
            }


            //Atualizar entrega 

            statusEntregaDefault = "calculado";
            if (statusEntrega) {
                if (statusEntrega.toLowerCase() != "calculado" && statusEntrega.toLowerCase() != "entregue" && statusEntrega.toLowerCase() != "calculado" && statusEntrega.toLowerCase() != "em transito") {
                    return res.status(400).json({ erro: "status entrega inválido " });
                }
                statusEntregaDefault = statusEntrega;
            }

            const pedidoAtual = pedido[0];

            console.log(pedido);



            //Infromações atualizadas
            const idClienteAtualizado = idCliente ?? pedidoAtual.idCliente;
            const dataPedidoAtualizado = dataPedido ?? pedidoAtual.dataPedido;
            const tipoEntregaAtualizado = tipoEntrega ?? pedidoAtual.tipoEntrega;
            const distanciaAtualizada = distancia ?? pedidoAtual.distancia;
            const pesoCargaAtualizada = pesoCarga ?? pedidoAtual.pesoCarga;
            const valorKmAtualizado = valorKm ?? pedidoAtual.valorKm;
            const valorKgAtualizado = valorKg ?? pedidoAtual.valorKg;
            const statusEntregaAtualizado = statusEntrega ?? entregaAntigo?.[0]?.statusEntrega ?? "calculado";
            //"...entregaAntigo?.[0]?.statusEntrega ... "?." impede o erro

            const valorDistanciaAtualizado = distanciaAtualizada * valorKgAtualizado;
            const valorPesoAtualizado = pesoCargaAtualizada * valorKmAtualizado;

            let valorBaseAtualizado = valorDistanciaAtualizado + valorPesoAtualizado;

            let valorFinalAtualizado = valorBaseAtualizado;
            let acrescimoAtualizado = 0;

            if (tipoEntregaAtualizado == "urgente".toLocaleLowerCase) {
                acrescimoAtualizado = valorBaseAtualizado * 0.20;
                valorFinalAtualizado = valorFinalAtualizado + acrescimoAtualizado;
            }

            let descontoAtualizado = 0;
            if (valorFinalAtualizado > 500) {
                descontoAtualizado = valorFinalAtualizado * 0.1;
                valorFinalAtualizado = valorFinalAtualizado - descontoAtualizado;
            }

            let taxaExtraAtualizado = 0;
            if (pesoCargaAtualizada > 50) {
                taxaExtraAtualizado = 15;
                valorFinalAtualizado = valorFinalAtualizado + taxaExtraAtualizado;
            }

            await pedidoModel.atualizarPedido(
                idPedido,
                idClienteAtualizado,
                dataPedidoAtualizado,
                tipoEntregaAtualizado,
                distanciaAtualizada,
                pesoCargaAtualizada,
                valorKmAtualizado,
                valorKgAtualizado,
                acrescimoAtualizado,
                descontoAtualizado,
                taxaExtraAtualizado,
                valorDistanciaAtualizado,
                valorPesoAtualizado,
                valorFinalAtualizado,
                statusEntregaAtualizado,
            );

            res.status(200).json({ mensagem: "Pedido atualizado com sucesso!" });

        } catch (error) {
            console.error("Erro ao atualizar pedido:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao atualizar pedido!" });
        }
    },


    /**
     * @async
     * @function deletarPedido
     * @param {*} req - Objeto da requisição (recebido do cliente HTTP)
     * @param {*} res Objeto da resposta (enviado ao cliente HTTP)
     * @returns {Promise<Array} {mensagem: `Pedido deltado com suceso!`}.
     * @throws Mostra no console e retorna erro 500  se ocorrer falha ao deletar o pedido.
     */
    deletarPedido: async (req, res) => {
        try {
            //Deletar pedido
            const { idPedido } = req.params;

            if (!idPedido || idPedido.length !== 36) {
                return res.status(400).json({ erro: "ID do pedido inválido!" });
            }

            //Buscar apenas um pedido
            const pedido = await pedidoModel.buscarUm(idPedido);

            //Verificar se o pedido existe/ se o id é válido
            if (!pedido || pedido.length === 0) {
                return res.status(404).json({ erro: "Pedido não encontrado!" });
            }

            //Deletar pedido
            await pedidoModel.deletarPedido(idPedido);

            res.status(200).json({ message: 'Pedido deletado com sucesso!' });

        } catch (error) {
            console.error("Erro ao deletar pedido:", error);
            throw error;
            //res.status(500).json({ erro: "Erro interno ao deletar pedido!", errorMessage: error.message});
        }
    }

}



module.exports = { pedidoController };





