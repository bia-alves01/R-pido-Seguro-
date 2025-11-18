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
            
            if (result.lenght > 0 ) {
                return res.status(409).json({erro: `CPF já cadastrado!`});
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
            const {idCliente} = req.params;
            const {nomeCliente, cpfCliente, telCliente, emailCliente, endCliente} = req.body;

            if (idCliente.length != 36) {
                return res.status(400).json({erro: "id do cliente inválido!"});
            }

            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length !== 1) {
                return res.status(401).json({erro: "Cliente não encontrado!"});
            }
        

        const {clienteAtual, cpfClienteAtual, telClienteAtualizado, emailClienteAtual, endClienteAtaul} = cliente[0];

        const clienteNome = nomeCliente ?? clienteAtual.nomeCliente;
        const clienteCpf = cpfCliente ?? cpfClienteAtual.cpfCliente;
        const clienteTel = telCliente ?? telClienteAtualizado.telCliente;
        const clienteEmail = emailCliente ?? emailClienteAtual.emailCliente;
        const clienteEnd = endCliente ?? endClienteAtaul.emailCliente;

        await clienteModel.atualizarCliente(clienteNome, clienteCpf, clienteTel, clienteEmail, clienteEnd);

        res.status(200).json({mensagem: "Cliente atualizado com sucesso!"});

        } catch (error) {
            console.error(`Erro ao atualizar cliente:`, error);
            res.status(500).json({ erro: "Erro interno no servidor ao atualizar cliente!"});
        }
    },

    deletarCliente: async (req, res) => {
        try {
            const {idCliente} = req.params;

            if (idCliente.length != 36) {
                return res.status(400).json({erro: "id do cliente inválido!"});
            }

            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length !== 1) {
                return res.status(401).json({erro: "Cliente não enontrado!"});
            }

            await clienteModel.deletarCliente(idCliente);
            res.status(200).json({mensagem: "Cliente deletado com sucesso!"});

        } catch (error) {
            console.error(`Erro ao deletar cliente:`, error);
            res.status(500).json(`Erro interno no servidor ao deletar cliente!`);
            throw error;
        }
    }
}

module.exports = {clienteController};