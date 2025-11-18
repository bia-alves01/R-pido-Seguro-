const { sql, getConnection} = require("../config/db");

    /**
     * Busca todos os pedidos e seus respectivos itens no banco de dados.
     * 
     * @async
     * @function buscarTodos
     * @returns {Promise<Array} Retorna uma lista com todos os pedidos e seus itens.
     * @throws Mostra no console e propaga o erro caso a busca falhe.
     */

    const pedidoModel = {

    buscarTodos: async () => {
        try {
            const pool = await getConnection();

            const querySQL = `
                SELECT 
                    CL.idCliente,
	                PD.dataPedido,
	                PD.tipoEntrega,
	                PD.distancia,
                	PD.pesoCarga,
                    PD.valorKm,
                    PD.valorKg
                FROM Pedidos PD
            `;

            const result = await pool.request()
            .query(querySQL);

            return result.recordset;

        } catch (error) {
           console.error("Erro ao buscar pedido:", error);
           throw error; 
        }
    },

    buscarUm: async (idPedido) => {
        try {
            const pool = await getConnection();
            const querySQL = 'SELECET * FROM Pedidos WHERE idPedido = @idPedido'

            const result = await pool.request()
            .input("idPedido", sql.UniqueIdentifier, idPedido)
            .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error("Erro ao buscar o pedido:", error);
            throw error;
        }
    },

    inserirPedido: async (idCliente, dataPedido, tipoEntrega, distancia, pesoCarga, valorKm, valorKg ) => {
        //{itens} realiza a desestruturação do objeto itens

        const pool = await getConnection();

        const transaction = new sql.Transaction(pool);
        await transaction.begin(); //Inicia transação

        try {
            let querySQL = `
               INSERT INTO Pedidos (idCliente, dataPedido, tipoEntrega, distancia, pesoCarga, valorKm, valorKg)
               OUTPUT INSERTED.idPedido
               VALUES (@idCliente, @dataPedido, @tipoEntrega, @distancia, @pesoCarga, @valorKm, @valorKg)
            `

            const result = await transaction.request()
            .input("idCliente", sql.UniqueIdentifier, idCliente)
            .input("dataPedido", sql.Date, dataPedido)
            .input("tipoEntrega", sql.VarChar, tipoEntrega)
            .input("distancia", sql.Decimal(10,2), distancia)
            .input("pesoCarga", sql.Decimal(10,2), pesoCarga)
            .input("valorKm", sql.Decimal(10,2), valorKm)
            .input("valorKg", sql.Decimal(10,2), valorKg)
            .query(querySQL);   

            await transaction.commit(); // Confirma a transação (salva tudo no banco)

        } catch (error) {
            await transaction.rollback(); //Desfaz tudo caso dê erro
            console.error(`Erro ao inserir pedido!`, error);
            throw error;
        }
    },

    atualizarPedido: async (idPedido, idCliente, dataPedido, tipoEntrega, distancia, pesoCarga, valorKm, valorKg) => {
        try {
            const pool = await getConnection();

            const querySQL = `
             UPDATE Pedidos
             SET idCliente = @idCliente,
                dataPedido = @datePedido,
                tpoEntrega = @tipoEntrega, 
                distancia = @distancia,
                pesoCarga = @pesoCarga, 
                valorKm = @valorKm, 
                valorKg = @valorKg
                
             WHERE idPedido = @idPedido   
            `
            await pool.request()
             .input("idCliente", sql.UniqueIdentifier, idCliente)
             .input("dataPedido", sql.Date, dataPedido)
             .input("tipoEntrega", sql.VarChar, tipoEntrega)
             .input("distancia", sql.Decimal(10,2), distancia)
             .input("pesoCarga", sql.Decimal(10,2), pesoCarga)
             .input("valorKm", sql.Decimal(10,2), valorKm)
             .input("valorKg", sql.Decimal(10,2), valorKg)

        } catch (error) {
            console.error(`Erro ao atualizar pedido:`, error);
            throw error;
        }
    },

    deletarPedido: async(idPedido) => {
        const pool = await getConnection;
        const transaction = new sql.Transaction(pool);
        await transaction.begin();
        
        try {
            
            let querySQL = `
               DELETE FROM Pedidos
               WHERE idPedido = @idPedido
            `;

            await transaction.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .query(querySQL);

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            console.error(`Erro ao deletar pedido:`, error);
            throw error;
        }
    }

};

module.exports = {pedidoModel};