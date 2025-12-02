const { sql, getConnection } = require("../config/db");

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

            const querySQL = `SELECT * FROM Pedidos`;

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
            const querySQL = 'SELECT * FROM Pedidos WHERE idPedido = @idPedido';

            const result = await pool.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error("Erro ao buscar o pedido:", error);
            throw error;
        }
    },

    inserirPedido: async (idCliente, dataPedido, tipoEntrega, distancia, pesoCarga, valorKm, valorKg, valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega) => {

        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            let querySQL = `
               INSERT INTO Pedidos (idCliente, dataPedido, tipoEntrega, distancia, pesoCarga, valorKm, valorKg)
               OUTPUT INSERTED.idPedido
               VALUES (@idCliente, @dataPedido, @tipoEntrega, @distancia, @pesoCarga, @valorKm, @valorKg)
            `

            //request de pedidos
            const result = await transaction
                .request()
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.Date, dataPedido)
                .input("tipoEntrega", sql.VarChar(7), tipoEntrega)
                .input("distancia", sql.Decimal(10, 2), distancia)
                .input("pesoCarga", sql.Decimal(10, 2), pesoCarga)
                .input("valorKm", sql.Decimal(10, 2), valorKm)
                .input("valorKg", sql.Decimal(10, 2), valorKg)
                .query(querySQL);

            const idPedido = result.recordset[0].idPedido;

            console.log(idPedido);

            //qurySQL das entregas:
            querySQL = `
                INSERT INTO Entrega
                    (idPedido, valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega)
                VALUES
                    (@idPedido, @valorDistancia, @valorPeso, @acrescimo, @desconto, @taxaExtra, @valorFinal, @statusEntrega)
            `;

            //resquest das entregas:
            await transaction.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .input("valorDistancia", sql.Decimal(10, 2), valorDistancia)
                .input("valorPeso", sql.Decimal(10, 2), valorPeso)
                .input("acrescimo", sql.Decimal(10, 2), acrescimo)
                .input("desconto", sql.Decimal(10, 2), desconto)
                .input("taxaExtra", sql.Decimal(10, 2), taxaExtra)
                .input("valorFinal", sql.Decimal(10, 2), valorFinal)
                .input("statusEntrega", sql.VarChar(20), statusEntrega)
                .query(querySQL);

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            console.error(`Erro ao inserir pedido!`, error);
            throw error;
        }
    },


    atualizarPedido: async (idPedido, idCliente,dataPedido, tipoEntrega, distancia, pesoCarga, valorKm, valorKg, acrescimo, desconto, taxaExtra, valorDistancia, valorPeso, valorFinal, statusEntrega, idEntrega) => {

        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {

            const pool = await getConnection();

            let querySQL = `
             UPDATE Pedidos
             SET idCliente = @idCliente,
               dataPedido = @dataPedido,
               tipoEntrega = @tipoEntrega,
               distancia = @distancia,
               pesoCarga = @pesoCarga,
               valorKm = @valorKm,
               valorKg = @valorKg
                
             WHERE idPedido = @idPedido   
            `
            await transaction.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.Date, dataPedido)
                .input("tipoEntrega", sql.VarChar, tipoEntrega)
                .input("distancia", sql.Decimal(10, 2), distancia)
                .input("pesoCarga", sql.Decimal(10, 2), pesoCarga)
                .input("valorKm", sql.Decimal(10, 2), valorKm)
                .input("valorKg", sql.Decimal(10, 2), valorKg)
                .query(querySQL);

            //Atualizar entrega

            //request da entrega
            querySQL =
                `UPDATE Entrega
                SET idPedido = @idPedido,
                    valorDistancia = @valorDistancia,
                    valorPeso = @valorPeso,
                    acrescimo = @acrescimo,
                    desconto = @desconto,
                    taxaExtra = @taxaExtra,
                    valorFinal = @valorFinal,
                    statusEntrega = @statusEntrega

                WHERE idEntrega = @idEntrega
            `;

            await transaction.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .input("valorDistancia", sql.Decimal(10, 2), valorDistancia)
                .input("valorPeso", sql.Decimal(10, 2), valorPeso)
                .input("acrescimo", sql.Decimal(10, 2), acrescimo)
                .input("desconto", sql.Decimal(10, 2), desconto)
                .input("taxaExtra", sql.Decimal(10, 2), taxaExtra)
                .input("valorFinal", sql.Decimal(10, 2), valorFinal)
                .input("statusEntrega", sql.VarChar(11), statusEntrega)
                .input("idEntrega", sql.UniqueIdentifier, idEntrega)
                .query(querySQL);

            await transaction.commit();

        } catch (error) {
            console.error(`Erro ao atualizar pedido:`, error);
            throw error;
        }
    },

    deletarPedido: async (idPedido, idEntrega) => {

        const pool = await getConnection();

        try {
            //Deletar pedido       
            let querySQL = `
            DELETE FROM Pedidos
            WHERE idPedido = @idPedido
        `;

            await pool.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .query(querySQL);

            return res.status(200).json(`Pedido deletado com sucesso!`);

        } catch (error) {
            console.error(`Erro ao deletar pedido:`, error);
            throw error;
        }
    }

};

module.exports = { pedidoModel };