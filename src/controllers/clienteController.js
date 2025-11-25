const {clienteModel} = require("../models/clienteModel");

const clienteController = {
    listarClientes: async (req, res)=>{
        try {

            const {idCliente} = req.query;

            if (idCliente) {
                if (idCliente.lenght != 36) {
                    return res.status(400).json({erro: "id do cliente inválido"});
                }
                
            const cliente = await clienteModel.buscarUm(idCliente);

            return res.status(200).json(cliente);
            }

            const clientes = await clienteModel.buscarTodos();
            res.status(200).json(clientes);

        } catch (error) {
            console.error('Erro ao lista os clientes:', error);
            res.status(500).json({message: 'Erro ao buscar clientes'});
        }
    },


    criarCliente: async (req, res) => {
        try {
            const {nomeCliente, cpfCliente, telCliente, emailCliente, endCliente} = req.body;

            if(nomeCliente == undefined || cpfCliente == undefined || telCliente == undefined || emailCliente == undefined || endCliente == undefined){
                return res.status(400).json(`Campos obrigatórios não respondidos!`);
            }

            const result = await clienteModel.buscarPorCPF(cpfCliente);
            
            if (result.length > 0 ) {
                return res.status(409).json({erro: `CPF já cadastrado!`});
            }

            const existenteEmail = await clienteModel.buscarPorEmail(emailCliente);

            if (existenteEmail) {
                return res.status(400).json({ erro: "E-mail já cadastrado!" });
            }

            await clienteModel.cadastrarCliente(nomeCliente, cpfCliente, telCliente, emailCliente, endCliente);

            res.status(200).json({message: `Cliente cadastrado com sucesso!`});

        } catch (error) {
            console.error(`Erro ao criar cliente!`, error);
            res.status(500).json({erro: `Erro no servidor ao cadastradar cliente!`});
        }
    },

    atualizarCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const { nomeCliente, cpfCliente, telCliente, emailCliente, endCliente } = req.body;

            const clienteResultado = await clienteModel.buscarUm(idCliente);

            if (!clienteResultado || clienteResultado.length === 0) {
                console.log("idCliente (params):", idCliente);
                console.log("tipo do id:", typeof idCliente);
                return res.status(404).json({ erro: "Cliente não encontrado!" });
            }

            const clienteAtual = clienteResultado[0]; 

            const nomeAtualizado  = nomeCliente  ?? clienteAtual.nomeCliente;
            const cpfAtualizado   = cpfCliente   ?? clienteAtual.cpfCliente;
            const telAtualizado   = telCliente   ?? clienteAtual.telCliente;
            const emailAtualizado = emailCliente ?? clienteAtual.emailCliente;
            const endAtualizado   = endCliente   ?? clienteAtual.endCliente;

            await clienteModel.atualizarCliente(
                idCliente,
                nomeAtualizado,
                cpfAtualizado,
                telAtualizado,
                emailAtualizado,
                endAtualizado
            );

            res.status(200).json({ mensagem: "Cliente atualizado com sucesso!" });

        } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        res.status(500).json({ erro: "Erro interno no servidor ao atualizar cliente!" });
        }
    },

    deletarCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;

            if (!idCliente || idCliente.length !== 36) {
                return res.status(400).json({ erro: "id do cliente inválido!" });
            }

            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length === 0) {
                return res.status(404).json({ erro: "Cliente não encontrado!" });
            }

            await clienteModel.deletarCliente(idCliente);

            return res.status(200).json({ mensagem: "Cliente deletado com sucesso!" });

        } catch (error) {
            console.error("Erro ao deletar cliente:", error);
            return res.status(500).json({ erro: "Erro interno no servidor ao deletar cliente!" });
        }
    }
    
}

module.exports = {clienteController};