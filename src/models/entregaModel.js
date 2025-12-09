const { sql, getConnection } = require("../config/db");

const entregaModel = {
    /**
     * Buscar todoas as entregas e suas respctivas informações.
     * 
     * @async
     * @function buscarTodos
     * @returns {Promise<Array} Retornar uma lista com todos as entregas.
     * @throws Mostrar no console o erro e propaga o erro caso a busca falhe.
     * 
     */

    buscarTodos: async () => {
        try {
            const pool = await getConnection();

            //Buscar todas as entregas dentro do banco de dados
            const querySQL = 'SELECT * FROM Entrega';

            const result = await pool.request()
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar entregas: ', error);
            throw error;
        }
    },


    /**
     * Buscar apenas uma entrega específica.
     * 
     * @async
     * @function buscarUm
     * @param {*} idEntrega 
     * @returns Retornar um lista com apenas uma entrega, através do id da entrega.
     * @throws Mostra no console o erro e divulga o erro caso não for possível buscar apenas uma entrega.
     */
    buscarUm: async (idEntrega) => {
        try {
            const pool = await getConnection();

            //Buscar apenas uma entrega através do id
            const query = ` SELECT * FROM Entrega WHERE idEntrega = @idEntrega`;

            const result = await pool.request()
                .input("idEntrega", sql.UniqueIdentifier, idEntrega)
                .query(query);

            return result.recordset;

        } catch (error) {
            console.error("Erro ao buscar entrega por ID:", error);
            throw error;
        }
    },

    buscarPorIdPedido: async (idPedido) => {
        try {
            const pool = await getConnection();

            //Buscar apenas uma entrega através do id
            const query = ` SELECT * FROM Entrega WHERE idPedido = @idPedido`;

            const result = await pool.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .query(query);

            return result.recordset;

        } catch (error) {
            console.error("Erro ao buscar entrega por idPedido:", error);
            throw error;
        }
    },

    /**
     * Deletar a entrega 
     * 
     * @async
     * @function deletarEntrega
     * @param {*} idEntrega - Id para identificar a entrega do produto.
     * @returns "mensagem": "entrega deletado com sucesso!"
     * @throws Mostra no console o erro e divulga o erro caso não for possível deletar a entrega.
     */
    deletarEntrega: async (idEntrega) => {

        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            //Deletar entrega no banco de dados
            let querySQL = `DELETE FROM Entrega WHERE idEntrega = @idEntrega`;

            await transaction.request()
                .input("idEntrega", sql.UniqueIdentifier, idEntrega)
                .query(querySQL);

            await transaction.commit();

            //return res.status(200).json(`Entrega deletada com sucesso!`);

        } catch (error) {
            console.error(`Erro ao deletar entrega:`, error);
            throw error;
        }
    }
}

module.exports = { entregaModel };
