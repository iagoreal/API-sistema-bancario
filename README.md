![](https://portal.fgv.br/sites/portal.fgv.br/files/styles/noticia_geral/public/noticias/11/21/bancos-inovacao.jpg?itok=J_PdPo_2)

Minha tarefa neste projeto como desenvolvedor foi criar uma API para um Banco Digital. Esse será um projeto **piloto**, ou seja, no futuro outras funcionalidades poderão ser implementadas, portanto, dados do banco (nome, agência, etc.) serão imutáveis.

Meu papel foi construir uma RESTful API que permita:

-   Criar conta bancária
-   Listar contas bancárias
-   Atualizar os dados do usuário da conta bancária
-   Excluir uma conta bancária
-   Depósitar em uma conta bancária
-   Sacar de uma conta bancária
-   Transferir valores entre contas bancárias
-   Consultar saldo da conta bancária
-   Emitir extrato bancário

Obs: os dados serão persistidos em memória, no objeto existente dentro do arquivo `bancodedados.js`. **Todas as transações e contas bancárias deverão ser inseridas dentro deste objeto, seguindo a estrutura que já existe.**

## Pré-requisitos para rodar o sistema

### Essencial: biblioteca express.

### Opcional: nodemon e insomnia.


## Endpoints

### Listar contas bancárias

#### `GET` `/contas?senha_banco=Cubos123Bank`

Esse endpoint lista todas as contas bancárias existentes.


### Criar conta bancária

#### `POST` `/contas`

Esse endpoint criar uma conta bancária, onde será gerado um número único para identificação da conta (número da conta).


### Atualizar usuário da conta bancária

#### `PUT` `/contas/:numeroConta/usuario`

Esse endpoint atualiza apenas os dados do usuário de uma conta bancária.



### Excluir Conta

#### `DELETE` `/contas/:numeroConta`

Esse endpoint excluir uma conta bancária existente.



### Depositar

#### `POST` `/transacoes/depositar`

Esse endpoint somar o valor do depósito ao saldo de uma conta válida e registrar essa transação.



### Sacar

#### `POST` `/transacoes/sacar`

Esse endpoint realiza o saque de um valor em uma determinada conta bancária e registrar essa transação.



### Tranferir

#### `POST` `/transacoes/transferir`

Esse endpoint permite a transferência de recursos (dinheiro) de uma conta bancária para outra e registrar essa transação.



### Saldo

#### `GET` `/contas/saldo?numero_conta=123&senha=123`

Esse endpoint retorna o saldo de uma conta bancária.



### Extrato

#### `GET` `/contas/extrato?numero_conta=123&senha=123`

Esse endpoint lista as transações realizadas de uma conta específica.



