const { sql, getConnection } = require("../config/db");

const entregaModel = {

    buscarTodos: async () => {
        try {
            const pool = await getConnection();

            const querySQL = 'SELECT * FROM Entregas';

            const result = await pool.request()
            .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error('Erro ao buscar entregas: ', error);
            throw error;
        }
    },

    criarEntrega: async (valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega ) => {
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            const query = `
                INSERT INTO Entregas
                    (valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega)
                VALUES
                    (@valorDistancia, @valorPeso, @acrescimo, @desconto, @taxaExtra, @valorFinal, @statusEntrega)
            `;

            const result = await transaction.request()
                .input("valorDistancia", sql.Decimal(10, 2), valorDistancia)
                .input("valorPeso", sql.Decimal(10, 2), valorPeso)
                .input("acrescimo", sql.Decimal(10, 2), acrescimo )
                .input("desconto", sql.Decimal(10, 2), desconto )
                .input("taxaExtra", sql.Decimal(10, 2), taxaExtra )
                .input("valorFinal", sql.Decimal(10, 2), valorFinal)
                .input("statusEntrega", sql.VarChar(20), statusEntrega)
                .query(query);

            return result.recordset;

        } catch (error) {
            await transaction.rollback();
            console.error("Erro ao criar entrega:", error);
            throw error;
        }
    },

    buscarUm: async (idEntrega) => {
        try {
            const pool = await getConnection();

            const query = ` SELECT * FROM Entregas WHERE idEntrega = @idEntrega`;

            const result = await pool.request()
                .input("idEntrega", sql.UniqueIdentifier, idEntrega)
                .query(query);

            return result.recordset;

        } catch (error) {
            console.error("Erro ao buscar entrega por ID:", error);
            throw error;
        }
    },

 
    atualizarEntrega: async (idEntrega, valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega) => {
        const pool = await getConnection();

        const transaction = new sql.Transaction(pool);

        try {
            const query = `
                UPDATE Entregas
                SET 
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
                .input("valorDistancia", sql.Decimal(10,2), valorDistancia)
                .input("valorPeso", sql.Decimal(10,2), valorPeso)
                .input("acrescimo", sql.Decimal(10,2), acrescimo)
                .input("desconto", sql.Decimal(10,2), desconto)
                .input("taxaExtra", sql.Decimal(10,2), taxaExtra)
                .input("valorFinal", sql.Decimal(10,2), valorFinal)
                .input("statusEntrega", sql.VarChar(20), statusEntrega)
                .input("idEntrega", sql.UniqueIdentifier, idEntrega)
                .query(query);


        } catch (error) {
            await transaction.rollback();
            console.error("Erro ao atualizar entrega:", error);
            throw error;
        }
    },

    
    deletarEntrega: async (idEntrega) => {
        const pool = await getConnection();

        try {
            const querySQL = `DELETE FROM Entregas WHERE idEntrega = @idEntrega`;

            await pool.request()
                .input("idEntrega", sql.UniqueIdentifier, idEntrega)
                .query(querySQL);

            return res.status(200).json(`Entrega deletada com sucesso!`);

        } catch (error) {
            await transaction.rollback();
            console.error("Erro ao deletar entrega:", error);
            throw error;
        }
    }
};

module.exports = { entregaModel };
