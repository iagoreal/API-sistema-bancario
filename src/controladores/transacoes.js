const bancoDeDados = require('../bancodedados');
const {
    depositos,
    contas

} = require('../bancodedados');

const dataFormatada = require('date-fns/format');
const { brasil } = require('date-fns/locale');

const depositarConta = (req, res) => {
    const { numero_conta, valor } = req.body;

    // verificando se numero da conta e valor foi passado no body
    if (!numero_conta || !valor) {
        res.status(400).json({ "mensagem": "O número da conta e o valor são obrigatórios!" })
    }

    // verificando se a conta existe
    const conta = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta);
    });


    if (!conta) {
        return res.status(404).json({ "mensagem": "A conta não foi encontrada" });
    };


    // validar depósitos com valores negativos ou zerados
    if (valor === 0 || valor < 0) {
        res.status(400).json({ "mensagem": " O deposito precisa ser maior que zero" })
    }
    const dataOperacao = dataFormatada(new Date(), "dd'/'MM'/'yyyy HH':'mm':'ss", { locale: brasil });
    const novoDeposito = {
        data: dataOperacao,
        numero_conta: numero_conta,
        valor: +valor

    }
    depositos.push(novoDeposito);


    conta.saldo += novoDeposito.valor;


    return res.status(204).send();

}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    // verificando se a conta existe
    const conta = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta);
    });


    if (!conta) {
        return res.status(404).json({ "mensagem": "A conta não foi encontrada" });
    };

    // verificando se numero da conta, senha e valor foi passado no body
    if (!numero_conta || !valor || !senha) {
        res.status(400).json({ "mensagem": "Os campos: Numero da conta, valor do saque e a senha da conta devem ser informados!" })
    }

    // verificando a senha passada
    if (senha !== conta.usuario.senha) {
        res.status(401).json({ "mensagem": "Senha incorreta" });

    }

    // verificando se há saldo na conta para efeturar saque
    if (conta.saldo < valor) {
        res.status(400).json({ "mensagem": "Saldo insuficiente" });
    } else {
        conta.saldo -= valor
    }
    const dataOperacao = dataFormatada(new Date(), "dd'/'MM'/'yyyy HH':'mm':'ss", { locale: brasil });

    const novoSaque = {
        data: dataOperacao,
        numero_conta,
        valor

    }

    bancoDeDados.saques.push(novoSaque);
    return res.status(204).send();

}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem) {
        res.status(400).json({ mensagem: "o numero da conta de origem é obrigatório" });
    }

    if (!numero_conta_destino) {
        res.status(400).json({ mensagem: "o numero da conta de destino é obrigatório" });
    }

    if (!valor) {
        res.status(400).json({ mensagem: "o valor a ser transferido é obrigatório" });
    }

    if (!senha) {
        res.status(400).json({ mensagem: "por favor, informe a senha da conta de origem" });
    }

    // verificando se a conta de origem existe
    const contaOrigem = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta_origem);
    });

    if (!contaOrigem) {
        return res.status(404).json({ "mensagem": "A conta de origem não foi encontrada" });
    };

    // verificando se a conta de destino existe
    const contaDestino = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta_destino);
    });

    if (!contaDestino) {
        return res.status(404).json({ "mensagem": "A conta de destino não foi encontrada" });
    };

    // verificando senha da conta
    if (senha !== contaOrigem.usuario.senha) {
        res.status(401).json({ "mensagem": "Senha incorreta" });

    }

    // validando se há saldo disponivel para transferência
    if (valor > contaOrigem.saldo) {
        res.status(400).json({ "mensagem": "Saldo insuficiente." })
    }
    if (valor <= contaOrigem.saldo && senha === contaOrigem.usuario.senha) {
        contaOrigem.saldo -= Number(valor);
        contaDestino.saldo += Number(valor);
    }
    const dataOperacao = dataFormatada(new Date(), "dd'/'MM'/'yyyy HH':'mm':'ss", { locale: brasil });
    const novaTransferencia = {
        data: dataOperacao,
        numero_conta_origem,
        numero_conta_destino,
        valor
    }

    bancoDeDados.transferencias.push(novaTransferencia);


    res.status(204).send();

}

const consultarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (numero_conta === " " && senha === " ") {
        res.status(400).json({ "mensagem": "É necessário passar o numero da conta e a senha" });
    }

    // verificando se a conta existe
    const conta = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ "mensagem": "A conta não foi encontrada" });
    };

    // validando senha passada no query
    if (senha !== conta.usuario.senha) {
        res.status(401).json({ "mensagem": "Senha da conta incorreta" });
    }

    res.status(201).json(`saldo: ${conta.saldo}`);


}

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (numero_conta === " " && senha === " ") {
        res.status(400).json({ "mensagem": "É necessário passar o numero da conta e a senha" });
    }

    // verificando se a conta existe
    const conta = contas.find((conta) => {
        return conta.numero_conta === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ "mensagem": "A conta não foi encontrada" });
    };

    // validando senha passada no query
    if (senha !== conta.usuario.senha) {
        res.status(401).json({ "mensagem": "Senha da conta incorreta" });
    }


    const transferenciaRecebidas = bancoDeDados.transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino === numero_conta
    });
    const transferenciaEnviadas = bancoDeDados.transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem === numero_conta
    });

    const depositoConta = bancoDeDados.depositos.filter((deposito) => {
        return deposito.numero_conta === numero_conta;
    });

    const saqueConta = bancoDeDados.saques.filter((saque) => {
        return saque.numero_conta === numero_conta;
    });


    let extratoConta = {
        depositos: [
            depositoConta
        ],
        saques: [
            saqueConta
        ],
        transferenciaEnviadas,
        transferenciaRecebidas

    }


    res.status(200).json(extratoConta);

}


module.exports = {
    depositarConta,
    sacar,
    transferir,
    consultarSaldo,
    extrato

}
