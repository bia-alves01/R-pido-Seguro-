const { entregaModel } = require("../models/entregaModel");

const entregaController = {

    /**
     * @async
     * @function listarEntrega
     * @param {*} req - Objeto da requisição (recebido do cliente HTTP)
     * @param {*} res - Objeto da resposta (enviado ao cliente HTTP)
     * @returns lRetorna uma lista de todas ou uma entrega(s).
     * @throws Mostra no console o erro e divulga o erro caso não for possível listar as entregas.
     */
    //Listar as entregas
    listarEntrega: async (req, res) => {
        try {
            const { idEntrega } = req.params;

            //Listar apenas uma entrega 
            if (idEntrega) {
                if (idEntrega.lenght != 36) {
                    return res.status(400).json({ erro: `Id da entrega não encontrado! ` })
                }
                const entrega = await clienteModel.buscarUm(idEntrega);

                return res.status(200).json(entrega);
            }

            //Listar  todas as entregas
            const entregas = await entregaModel.buscarTodos();
            res.status(200).json(entregas);


        } catch (error) {
            res.status(500).json({ erro: `Erro interno no servidor ao listar entrega!` });
            throw error;
        }
    },

    
    /**
     * @async
     * @function deletarEntrega
     * @param {*} req - Objeto da requisição (recebido do cliente HTTP)
     * @param {*} res - Objeto da resposta (enviado ao cliente HTTP)
     * @returns Deleta a entrega identificado pelo ID.
     * @throws Mostra no console o erro e divulga o erro caso não for possível deletar a entrega.
     */
    deletarEntrega: async (req, res) => {
        try {

            //Deletar entrega 
            const { idEntrega } = req.params;

            //Verificar se id é válido
            if (idEntrega.length != 36) {
                return res.status(400).json({ erro: 'id da entrega inválido' });
            }


            await entregaModel.deletarEntrega(idEntrega);

            res.status(200).json({ message: 'Entrega deletada com sucesso!' });

        } catch (error) {
            console.error("Erro ao deletar entrega:", error);
            res.status(500).json({ erro: "Erro interno ao deletar entrega!" });
        }
    }
}

module.exports = { entregaController };
