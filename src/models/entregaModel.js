const { sql, getConnection } = require("../config/db");

const entregaModel = {
    /**
     * Buscar todoas as entregas e suas respctivas informações.
     * 
     * @async
     * @function buscarTodos
     * @returns {Promise<Array} Retornar uam lista com todos as entregas.
     * @throws Mostrar no console o erro e propaga o erro caso a busca falhe.
     * 
     */

    buscarTodos: async () => {
        try {
            const pool = await getConnection();

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
     * @async
     * @function buscarUm
     * @param {*} idEntrega 
     * @returns Retornar um lista com apenas uma entre, atraves do id da entrega
     */
    buscarUm: async (idEntrega) => {
        try {
            const pool = await getConnection();

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

    /**
     * @async
     * @function deletarEntrega
     * @param {*} idEntrega 
     * @returns "mensagem": "entrega deletado com sucesso!"
     */
    deletarEntrega: async (idEntrega) => {

        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            //Deletar entrega
            const querySQL = `DELETE FROM Entrega WHERE idEntrega = @idEntrega`;

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
