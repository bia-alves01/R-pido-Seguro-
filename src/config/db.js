const sql = require("mssql");

//O banco de dados que fará a conexão
const config = {
    user: 'mmodestto__SQLLogin_2',
    password: 'mtt8rvonql',
    server: 'rapidoESeguroLogistica.mssql.somee.com',
    database: 'rapidoESeguroLogistica',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
}

//Conectar o vsCode com o SQL 
async function getConnection(){
    try {
        
        const pool = await sql.connect(config);
        return pool;

    } catch (error) {
        console.error('Erro na conexão do SQL Server:', error );
    }
}

(async () => {
    const pool = await getConnection();

    if (pool) {
        console.log("Conexão com o BD realizada com sucesso!");
    }
})();

module.exports = {sql, getConnection};