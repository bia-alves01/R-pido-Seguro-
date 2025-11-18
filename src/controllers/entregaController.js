const {entregaModel} = require("..//models/entregaModel");

const clienteController = {
    criarEntrega: async (req, res) => {
        try {
            const {valorDistancia, valorPeso, acrescimo, desconto, taxaExtra, valorFinal, statusEntrega} = req.body;

            if(valorDistancia == undefined || valorPeso == undefined || valorFinal == undefined || statusEntrega == undefined){
                return res.status(400).json(`Campos obrigatórios não respondidos!`);
            }



        } catch (error) {
            
        }
    }
}