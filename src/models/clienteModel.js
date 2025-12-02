const {sql, getConnection } = require(`../config/db`);

const clienteModel = {

    /**
     * Criar um cliente novo
     * 
     * @async
     * @function cadastrarCliente
     * @returns {Promise<Array}Cadastrar um cliente novo
     * @throws "mensagem": "Erro ao cadastrar cliente!"
     * @param {*} nomeCliente 
     * @param {*} cpfCliente 
     * @param {*} telCliente 
     * @param {*} emailCliente 
     * @param {*} endCliente 
     * 
     */
    cadastrarCliente: async (nomeCliente, cpfCliente, telCliente, emailCliente, endCliente) => {
        try {
            const pool = await getConnection();

            let querySQL = 'INSERT INTO Clientes(nomeCliente, cpfCliente, telCliente, emailCliente, endCliente) VALUES(@nomeCliente, @cpfCliente, @telCliente, @emailCliente, @endCliente)';

            await pool.request()
            .input('nomeCliente', sql.VarChar(100), nomeCliente)
            .input('cpfCliente', sql.Char(11), cpfCliente)
            .input('telCliente', sql.Char(12), telCliente)
            .input('emailCliente', sql.VarChar(100), emailCliente)
            .input('endCLiente', sql.VarChar(250), endCliente)
            .query(querySQL);


        } catch (error) {
            console.log(`Erro ao cadastrar Clientes!`, error);
            throw error;
        }
    },

    /**
     * @async 
     * @function buscarUm
     * @param {*} idCliente 
     * @returns {Promise<Array} retorna uma lista com apenas um cliente
     */

    buscarUm: async (idCliente) => {
        try {
            const pool = await getConnection();

            const querySQL = 'SELECT * FROM Clientes WHERE idCliente = @idCliente';
            
            const result = await pool
            .request()
            .input(`idCliente`, sql.VarChar(36), idCliente)
            .query(querySQL);

        return result.recordset

        } catch (error) {
            console.error(`Erro au buscar o cliente:`, error);
            throw error;
        }
    },

    buscarPorEmail: async (emailCliente) => {
        try {

            const pool = await getConnection();

            let querySQL = 'SELECT * FROM Clientes WHERE emailCliente = @emailCliente';

            const result = await pool.request()
            .input("emailCliente", sql.VarChar(100), emailCliente)
            .query(querySQL);

            return result.recordset[0]; 

        } catch (error) {
            console.error(`Erro: Email já cadastrado`, error);
            throw error;
        }
    },

    buscarPorCPF: async (cpfCliente) => {
        try {
            const pool = await getConnection();

            let querySQL = 'SELECT * FROM Clientes  WHERE cpfCliente = @cpfCliente'

            const result = await pool.request()
                .input('cpfCliente', sql.Char(11), cpfCliente)
                .query(querySQL)

            return result.recordset;

        } catch (error) {
            console.log(`Erro: CPF já cadastrado!`, error);
            throw error;
        }
    },

    /**
     * @async
     * @function buscarTodos
     * @returns {Promise<Array} Retorna uma lista com todos o clientes cadastrados
     * @throws Mostra no console o erro
     */
    buscarTodos: async ()=>{
        try {
            const pool = await getConnection();

            let querySQL = 'SELECT * FROM Clientes';

            const result = await pool.request()
            .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.log('Erro ao buscar clientes: ', error);
            throw error;
        }
    },

    /**
     * @async
     * @function atualizarCliente
     * @param {*} idCliente 
     * @param {*} nomeCliente 
     * @param {*} cpfCliente 
     * @param {*} telCliente 
     * @param {*} emailCliente 
     * @param {*} endCliente 
     * @returns {Promise,Array} Retorna os dados do cliente atualizado 
     * @throws Mostra no console o erro e propaga o erro caso a atualização falhe
     */
    atualizarCliente: async (idCliente, nomeCliente, cpfCliente, telCliente, emailCliente, endCliente) => {
        try {
            const pool = await getConnection();

            const querySQL = `
                UPDATE Clientes
                SET nomeCliente = @nomeCliente,
                    cpfCliente = @cpfCliente,
                    telCliente = @telCliente,
                    emailCliente = @emailCliente,
                    endCliente = @endCliente
                WHERE idCliente = @idCliente
            `;

            await pool.request()
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("nomeCliente", sql.VarChar(100), nomeCliente)
                .input("cpfCliente", sql.Char(11), cpfCliente)
                .input("telCliente", sql.VarChar(12), telCliente)
                .input("emailCliente", sql.VarChar(100), emailCliente)
                .input("endCliente", sql.VarChar(250), endCliente)
                .query(querySQL);

        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
            throw error;
        }
    },

    /**
     * @async
     * @function deletarCliente
     * @param {*} idCliente 
     */

    deletarCliente: async(idCliente) => {
        const pool = await getConnection();

        try {

            const querySQL = `
                DELETE FROM Clientes
                WHERE idCliente = @idCliente
            `;

            await pool.request()
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .query(querySQL);

        } catch (error) {
            await transaction.rollback();
            console.error("Erro ao deletar cliente:", error);
            throw error;
        }
    }
}

module.exports = {clienteModel}
