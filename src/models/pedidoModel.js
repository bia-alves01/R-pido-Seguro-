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

    /**
     * @async
     * @function buscarTodos
     * @returns {Promise<Array} Retorna uma lista com todos os pedidos.
     * @throws Mostrar no console o erro e divulga o erro caso a busca falhe.
     */
    buscarTodos: async () => {
        try {
            const pool = await getConnection();

            //Buscar todos os pedidos cadastrados no banco de dados
            const querySQL = `SELECT * FROM Pedidos`;

            const result = await pool.request()
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error("Erro ao buscar pedido:", error);
            throw error;
        }
    },

    /**
     * @async
     * @function buscarUm
     * @param {*} idPedido - Id para identificar o pedido.
     * @returns {Promise<Array} Retorna ums lista com um pedido específico.
     * @throws Mostrar no console o erro e divulga o erro caso a busca falhe.
     */
    buscarUm: async (idPedido) => {
        try {
            const pool = await getConnection();
            //Buscar apenas um pedido através do id
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

    /**
     * @async
     * @function inserirPedido
     * @param {*} idCliente - Id para identificar pedido.
     * @param {*} dataPedido - Data que o pedido foi feito.
     * @param {*} tipoEntrega - Tipo da entrega: normal ou urgente.
     * @param {*} distancia - Distância do pedido (em KM).
     * @param {*} pesoCarga - Peso da carga (em KG).
     * @param {*} valorKm - Valor base do KM .
     * @param {*} valorKg - Valor base do KG.
     * @param {*} valorDistancia - Valor da distância (distancia*valorKm).
     * @param {*} valorPeso - Valor do peso da carga (pesoCarga*valorKg).
     * @param {*} acrescimo - Acresimo no valor final de 20% caso o tipo da entrega for urgente.
     * @param {*} desconto - Desconto na compra caso o valor chega a mais de R$500,00.
     * @param {*} taxaExtra - Taxa extra fixa de R$15,00 caso o peso da carga for maior de 50KG
     * @param {*} valorFinal - Valor final da compra. 
     * @param {*} statusEntrega - Status da entrega: calculado, em transito, entregue, cancelado.
     * @returns {Promise<Array} Cadastrar um pedido novo. 
     * @throws Mostra no console o erro e divulga o erro caso não for possível cadastrar o pedido.
     */
    inserirPedido: async (idCliente, dataPedido, tipoEntrega, distancia, pesoCarga, valorKm, valorKg, valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega) => {

        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {

            //Inserir informações do pedido dentro do banco de dados
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


    /**
     * @async
     * @function atualizarPedido
     * @param {*} idCliente - Id para identificar pedido.
     * @param {*} dataPedido - Data que o pedido foi feito.
     * @param {*} tipoEntrega - Tipo da entrega: normal ou urgente.
     * @param {*} distancia - Distância do pedido (em KM).
     * @param {*} pesoCarga - Peso da carga (em KG).
     * @param {*} valorKm - Valor base do KM .
     * @param {*} valorKg - Valor base do KG.
     * @param {*} valorDistancia - Valor da distância (distancia*valorKm).
     * @param {*} valorPeso - Valor do peso da carga (pesoCarga*valorKg).
     * @param {*} acrescimo - Acresimo no valor final de 20% caso o tipo da entrega for urgente.
     * @param {*} desconto - Desconto na compra caso o valor chega a mais de R$500,00.
     * @param {*} taxaExtra - Taxa extra fixa de R$15,00 caso o peso da carga for maior de 50KG
     * @param {*} valorFinal - Valor final da compra. 
     * @param {*} statusEntrega - Status da entrega: calculado, em transito, entregue, cancelado.
     * @returns {Promise<Array} Retorna os dados do pedido atualizado.
     * @throws Mostra no console o erro e divulga o erro caso não for possível atualizar o pedido.
     */
    atualizarPedido: async (idPedido, idCliente, dataPedido, tipoEntrega, distancia, pesoCarga, valorKm, valorKg, acrescimo, desconto, taxaExtra, valorDistancia, valorPeso, valorFinal, statusEntrega, idEntrega) => {

        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {

            const pool = await getConnection();
            

            //Atualizar informações do pedido dentro do banco de dados
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

            //Atualizar as informações da entrega dentro do banco de dados
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
            await transaction.rollback();
            console.error(`Erro ao atualizar pedido:`, error);
            throw error;
        }
    },

    /**
     * @async
     * @function deletarPedido
     * @param {*} idPedido - Id para identificar o pedido.
     * @returns {Promise<Array} {mensagem: `Pedido deletado com sucesso!`}.
     * @throws Mostra no console o erro e divulga o erro caso não for possível deletar o pedido.
     */
    deletarPedido: async (idPedido) => {

        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            //Deletar pedido no banco de dados   
            let querySQL = `
            DELETE FROM Pedidos
            WHERE idPedido = @idPedido
        `;

            await pool.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .query(querySQL);

            await transaction.commit();

            //return res.status(200).json(`Pedido deletado com sucesso!`);

        } catch (error) {
            await transaction.rollback();
            console.error(`Erro ao deletar pedido:`, error);
            throw error;
        }
    }

};

module.exports = { pedidoModel };