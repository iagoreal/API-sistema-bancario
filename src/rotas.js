const express = require('express');
const servico = require('./controladores/servicos');
const transacao = require('./controladores/transacoes');
const validarSenha = require('./intermediario');

const rotas = express();


rotas.get('/contas', validarSenha, servico.listarContas);
rotas.post('/contas', servico.cadastrarConta);
rotas.put('/contas/:numeroConta/usuario', servico.atualizarConta);
rotas.delete('/contas/:numeroConta', servico.excluirConta);

rotas.post('/transacoes/depositar', transacao.depositarConta);
rotas.post('/transacoes/sacar', transacao.sacar);
rotas.post('/transacoes/transferir', transacao.transferir);
rotas.get('/contas/saldo', transacao.consultarSaldo);
rotas.get('/contas/extrato', transacao.extrato);


module.exports = rotas;