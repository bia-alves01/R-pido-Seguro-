const { entregaModel } = require("../models/entregaModel");

const entregaController = {

    listarEntrega: async (req, res) => {
        try {
            const {idEntrega} = req.params;

            if (idEntrega || idEntrega.lenght != 36) {
                return res.status(400).json({erro: `Id da entrega não encontrado! `})
            }

            const entregas = await entregaModel.buscarTodos();
            res.status(200).json(entregas);


        } catch (error) {
            const entregas = await entregaModel.buscarTodos();
            res.status(200).json(entregas);

        }
    },

    criarEntrega: async (req, res) => {
        try {
            
            const {valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega} = req.body;

            if (
                valorDistancia === undefined || valorPeso === undefined || valorFinal === undefined || statusEntrega === undefined) {
                return res.status(400).json("Campos obrigatórios não preenchidos!");
            }

            const rs = result.recordset[0]

            valorDistancia = rs.distanciaPedido * rs.valorKM;
            valorPeso = rs.cargaPedido * rs.valorKG
            valorBase = valorDistancia + valorPeso
            valorFinal = valorBase

            //acrescimo
            let acrescimoEntrega = 0
            if (rs.tipoEntrega.toLowerCase() == "urgente") {
                acrescimoEntrega = valorFinal * 0.2
            }
            valorFinal = valorFinal + acrescimoEntrega            
            
            //desconto
            let descontoEntrega = 0
            if (valorBase > 500) {
                descontoEntrega = valorBase * 0.1
            }

            //taxa extra
            let taxaEntrega = 0
            if (rs.cargaPedido > 50) {
                taxaEntrega = 15
            }
            valorFinal = valorFinal + taxaEntrega - descontoEntrega
            console.log({ valorFinal });

            const resultado = await entregaModel.criarEntrega(valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega);

            return res.status(201).json({mensagem: "Entrega criada com sucesso!", entrega: resultado});

        } catch (error) {
            console.error("Erro ao criar entrega:", error);
            return res.status(500).json("Erro interno no servidor ao criar entrega.");
        }
    },

    deletarEntrega: async (req, res) => {
        try {
            const { idEntrega } = req.params;

            if (idEntrega.length != 36) {
                return res.status(400).json({ erro: 'id da entrega inválido' });
            }

            const entrega = await entregaModel.buscarUm(idEntrega);

            if (!entrega || entrega.length !== 1) {
                return res.status(404).json({ erro: 'Entrega não encontrada!' });
            }

            await entregaModel.deletarEntrega(idEntrega);

            res.status(200).json({ message: 'Entrega deletada com sucesso!' });

        } catch (error) {
            console.error('Erro ao deletar entrega', error);
            res.status(500).json({ erro: 'Erro no servidor ao deletar entrega' });
        }
    }
}

module.exports = entregaController;
