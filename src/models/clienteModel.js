const {sql, getConnection } = require(`../config/db`);

const clienteModel = {
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
    buscarTodos: async ()=>{
        try {
            const pool = await getConnection();

            let sql = 'SELECT * FROM Clientes';

            const result = await pool.request()
            .query(sql);
            return result.recordset;

        } catch (error) {
            console.log('Erro ao buscar clientes: ', error);
            throw error;
        }
    },

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
