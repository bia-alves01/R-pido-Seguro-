const { sql, getConnection } = require(`../config/db`);

const entregaModel = {
    criarEntrega: async (valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega) => {
        try {
            const pool = await getConnection();
            
            let querySQL = 'INSERT INTO Entrega(valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega VALUES (@valorDistancia, @valorPeso, @acrescimo, @desconto, @taxaExtra, @valorFinal, @statusEntrega))'
    
            await pool.request()
            .input('valorDistancia', sql.DECIMAL(10,2), valorDistancia)
            .input('valorPeso'), sql.DECIMAL(10,2), valorPeso
            .input('acrescimo', sql.DECIMAL(10,2), acrescimo)
            .input('desconto', sql.DECIMAL(10,2), desconto)
            .input('taxaExtra', sql.DECIMAL(10,2), taxaExtra)
            .input('valorFinal', sql.DECIMAL(10,2), valorFinal)
            .input('statusEntrega', sql.VarChar(7), statusEntrega)
            .query(querySQL);
            
        } catch (error) {
            console.log(`Erro ao coletar informações!`);
            throw error;
        }
    },
    buscarTodos: async ()=>{
        try {
            const pool = await getConnection();

            let sql = 'SELECT * FROM Entrega';
            const result = await pool.request()
            .query(sql);
            return result.recordset;

        } catch (error) {
            console.log('Erro ao buscar informações da entrega: ', error);
            throw error;
        }
    },
    
}

module.exports = {entregaModel};