const { clienteModel } = require("../models/clienteModel");
const { pedidoModel } = require("../models/pedidoModel");

const clienteController = {

    /**
     * @async
     * @function listarClientes
     * @param {*} req - Objeto da requisição (recebido do cliente HTTP)
     * @param {*} res - Objeto da resposta (enviado ao cliente HTTP)
     * @returns Retorna uma lista com todos os clientes ou com apenas um cliente.
     * @throws Mostra no console o erro e divulga o erro caso não for possível listar cliente.
     */
    listarClientes: async (req, res) => {
        try {

            const { idCliente } = req.query;

            //Listar apenas um cliente através do seu id.
            if (idCliente) {
                if (idCliente.length != 36) {
                    return res.status(400).json({ erro: "id do cliente inválido" });
                }

                const cliente = await clienteModel.buscarUm(idCliente);

                return res.status(200).json(cliente);
            }

            //Listar todos os clientes
            const clientes = await clienteModel.buscarTodos();
            res.status(200).json(clientes);

        } catch (error) {
            console.error('Erro ao lista os clientes:', error);
            res.status(500).json({ message: 'Erro ao buscar clientes' });
        }
    },


    /**
     * @async
     * @function criarCliente
     * @param {*} req - Objeto da requisição (recebido do cliente HTTP)
     * @param {*} res  - Objeto da resposta (enviado ao cliente HTTP)
     * @returns {Promise<Array} {mensagem: `Cliente cadastrado com sucesso!`}.
     * @throws Mostra no console o erro e divulga o erro caso não for possível criar cliente.
     */
    criarCliente: async (req, res) => {
        try {
            const { nomeCliente, cpfCliente, telCliente, emailCliente, endCliente } = req.body;

            if (nomeCliente == undefined || cpfCliente == undefined || telCliente == undefined || emailCliente == undefined || endCliente == undefined) {
                return res.status(400).json({ erro: `Campos obrigatórios não respondidos!` });
            }

            //Caso o CPF do cliente já estiver cadastrado, não será possível criar um cliente com o mesmo CPF
            const result = await clienteModel.buscarPorCPF(cpfCliente);

            if (result.length > 0) {
                return res.status(409).json({ erro: `CPF já cadastrado!` });
            }

            //Caso o Email do cliente já estiver cadastrado, não será possível criar um cliente com o mesmo Email
            const existenteEmail = await clienteModel.buscarPorEmail(emailCliente);

            if (existenteEmail) {
                return res.status(400).json({ erro: "E-mail já cadastrado!" });
            }

            //Se após o usuário clocar todas as informações corretas, irá criar um novo cliente
            await clienteModel.cadastrarCliente(nomeCliente, cpfCliente, telCliente, emailCliente, endCliente);

            res.status(200).json({ message: `Cliente cadastrado com sucesso!` });

        } catch (error) {
            console.error(`Erro ao criar cliente!`, error);
            res.status(500).json({ erro: `Erro no servidor ao cadastradar cliente!` });
        }
    },

    /**
     * @async
     * @function atualizarCliente
     * @param {*} req - Objeto da requisição (recebido do cliente HTTP)
     * @param {*} res - Objeto da resposta (enviado ao cliente HTTP)
     * @returns {Promise<Array} Mostra os dados do cliente atualizados.
     * @throws Mostra no console o erro e divulga o erro caso não for possível atualizar cliente.
     */
    atualizarCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const { nomeCliente, cpfCliente, telCliente, emailCliente, endCliente } = req.body;

            //Atualizar o cliente
            const clienteResultado = await clienteModel.buscarUm(idCliente);

            if (!clienteResultado || clienteResultado.length === 0) {
                console.log("idCliente (params):", idCliente);
                console.log("tipo do id:", typeof idCliente);
                return res.status(404).json({ erro: "Cliente não encontrado!" });
            }

            //Caso o CPF do cliente já estiver cadastrado, não será possível criar um cliente com o mesmo CPF
            const result = await clienteModel.buscarPorCPF(cpfCliente);

            if (result.length > 0) {
                return res.status(409).json({ erro: `CPF já cadastrado!` });
            }

            //Caso o Email do cliente já estiver cadastrado, não será possível criar um cliente com o mesmo Email
            const existenteEmail = await clienteModel.buscarPorEmail(emailCliente);

            if (existenteEmail) {
                return res.status(400).json({ erro: "E-mail já cadastrado!" });
            }

            const clienteAtual = clienteResultado[0];

            //Informações atuzalizadas
            const nomeAtualizado = nomeCliente ?? clienteAtual.nomeCliente;
            const cpfAtualizado = cpfCliente ?? clienteAtual.cpfCliente;
            const telAtualizado = telCliente ?? clienteAtual.telCliente;
            const emailAtualizado = emailCliente ?? clienteAtual.emailCliente;
            const endAtualizado = endCliente ?? clienteAtual.endCliente;

            //Informações que serão atualizadas
            await clienteModel.atualizarCliente(idCliente, nomeAtualizado, cpfAtualizado, telAtualizado, emailAtualizado, endAtualizado);

            res.status(200).json({ mensagem: "Cliente atualizado com sucesso!" });

        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao atualizar cliente!" });
        }
    },

    /**
     * @async
     * @function deletarCliente
     * @param {*} req - Objeto da requisição (recebido do cliente HTTP)
     * @param {*} res - Objeto da resposta (enviado ao cliente HTTP)
     * @returns Deleta o cliente identificado pelo ID.
     * @throws Mostra no console o erro e divulga o erro caso não for possível deletar cliente.
     */
    deletarCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;

            //Verificar se id é válido
            if (!idCliente || idCliente.length !== 36) {
                return res.status(400).json({ erro: "id do cliente inválido!" });
            }

            //Buscar apenas o cliente informado pelo id
            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length <= 0) {
                return res.status(404).json({ erro: "Cliente não encontrado!" });
            }

            //Caso cliente tenha algum pedido cadastrado, não poderá ser deletado
            const pedidos = await pedidoModel.buscarPorIdCliente(idCliente);

            if (pedidos.length > 0) {
                return res.status(409).json({ erro: "Cliente com pedidos cadastrados, não é possível deletar!" });
            }

            //Deletar cliente
            await clienteModel.deletarCliente(idCliente);

            return res.status(200).json({ mensagem: "Cliente deletado com sucesso!" });

        } catch (error) {
            console.error("Erro ao deletar cliente:", error);
            return res.status(500).json({ erro: "Erro ao deletar cliente!", errorMessage: error.message });
        }
    }

}

module.exports = { clienteController };