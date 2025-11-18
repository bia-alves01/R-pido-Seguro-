# API Reference

### Clientes 

#### GET /cliente
- **Descrição**: Obtém uma lista de clientes ja cadastrados
- **Reponse**: Array do cliente

#### POST /cliente
- **Descrição**: Criar um novo cliente
- **Body**:
```
{
    "nomeCliente": "clienteExemplo",
    "cpfCliente": "12345678909",
    "telCLiente": "19 123459876",
    "emailCliente: "emailExemplo@gmail.com",
    "endCliente": "logradouro, número, bairro, cidade, estado, CEP"

}
```
- **Reponse**: 
```
{
    "message": "Cliente cadastrado com sucesso!"
}
```

#### PUT /Clientes
- **Descrição**: Atualizar cliente já existente
- **Body**: 
```
{
    "nomeCliente": "clienteAtual",
    "cpfCliente": "12345678909", -- CPF Atual
    "telCLiente": "19 123459876", -- telefone Atual
    "emailCliente: "emailExemplo@gmail.com", -- email Atual
    "endCliente": "logradouro, número, bairro, cidade, estado, CEP" -- endereço Atual
}
```
- **Reponse**: 
```
{
    "message": "Cliente atualizado com sucesso!"
}
```
### DELETE /Clientes
- **Descrição**: Deletar cliente
- **Body**:
```
({ Cliente deletado com sucesso!})
```

- **Reponse**: 
```
{
    "message": "Cliente deletado com sucesso!"
}
```

### Produtos

#### GET /Pedidos
- **Descrição**: Obtém uma lista dos pedidos
- **Response**: Array dos pedido

#### POST /Pedidos
- **Descrição**: Cria um novo pedido
- **Body**: 
```
{
    'idPedido, 
    idCliente, 
    "dataPedido" = 0000-00-00, 
    "distancia" = 00 KM, 
    "pesoCarga" = 00 KG, 
    "valorKm" = 00,00 , 
    "valorKg" = 00,00 ,
}
```
- **Response**: 
```
{
    message: "Produto cadastrado com sucesso!"
}
```

#### PUT /Pedidos
- **Descrição**: Atualizar informações dos pedidos
- **Body**:
````
{
    "dataPedido" = 0000-00-00, -- data Atualizada
    "distancia" = 00 KM, -- distancia Atualixada
    "pesoCarga" = 00 KG, -- peso Atualizado
    "valorKm" = 00,00 , -- valor atual
    "valorKg" = 00,00 , -- valor atual
}
````
- **Response**:
```
{
    message: "Pedido atualizado com sucesso!"
}
```

#### DELETE /Pedidos
- **Descrição**: Deletar pedido 
- **Response**:
````
{
    message: "Pedidos deleta com sucesso!"
}
````
