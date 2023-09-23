
const bancoDeDados = require('../bancodedados');
let {
    contas,
    numero_conta } = require('../bancodedados');

const listarContas = (req, res) => {

    return res.status(200).json(contas)
}


const cadastrarConta = (req, res) => {
    let { nome, cpf, data_nascimento, telefone, email, senha } = req.body;


    // validação caso não seja passado algum valor
    if (!nome) {
        res.status(400).json({ mensagem: "o nome é obrigatório" });
    }

    if (!cpf) {
        res.status(400).json({ mensagem: "o cpf é obrigatório" });
    }

    if (!data_nascimento) {
        res.status(400).json({ mensagem: "a data de nascimento é obrigatório" });
    }

    if (!telefone) {
        res.status(400).json({ mensagem: "o telefone é obrigatório" });
    }

    if (!email) {
        res.status(400).json({ mensagem: "o email é obrigatório" });
    }

    if (!senha) {
        res.status(400).json({ mensagem: " é obrigatório informar a senha" });
    }

    // validação email e cpf unicos
    const cpfExistente = contas.find((conta) => conta.usuario.cpf === cpf);
    const emailExistente = contas.find((conta) => conta.usuario.email === email);

    if (cpfExistente || emailExistente) {
        return res.status(400).json({ erro: 'CPF ou E-mail já cadastrado.' });
    }

    const novaConta = {
        numero_conta,
        saldo: Number(0),
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }

    }

    contas.push(novaConta);
    numero_conta++
    return res.status(201).send()

}

const atualizarConta = (req, res) => {
    const { numeroConta } = req.params;

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    // validação caso não seja passado algum valor
    if (!nome) {
        res.status(400).json({ mensagem: "o nome é obrigatório" });
    }

    if (!cpf) {
        res.status(400).json({ mensagem: "o cpf é obrigatório" });
    }

    if (!data_nascimento) {
        res.status(400).json({ mensagem: "a data de nascimento é obrigatório" });
    }

    if (!telefone) {
        res.status(400).json({ mensagem: "o telefone é obrigatório" });
    }

    if (!email) {
        res.status(400).json({ mensagem: "o email é obrigatório" });
    }

    if (!senha) {
        res.status(400).json({ mensagem: " é obrigatório informar a senha" });
    }


    const conta = contas.find((conta) => {
        return conta.numero_conta === Number(numeroConta);
    });

    if (!conta) {
        return res.status(404).json({ "mensagem": "Conta não encontrada" })
    }

    conta.usuario.nome = nome;
    conta.usuario.cpf = cpf;
    conta.usuario.data_nascimento = data_nascimento
    conta.usuario.telefone = telefone
    conta.usuario.email = email
    conta.usuario.senha = senha


    return res.status(204).send()

}

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    const conta = contas.find((conta) => {
        return conta.numero_conta === Number(numeroConta);
    });

    if (!conta) {
        return res.status(404).json({ "mensagem": "A conta não foi encontrada" });
    };


    if (conta.saldo === 0) {
        // excluir conta passada como parametro.
        contas = contas.filter((conta) => {
            return conta.numero_conta !== Number(numeroConta);
        });
    } else {
        return res.status(400).json({ "mensagem": "A conta só pode ser removida se o saldo for zero!" });
    }
    return res.status(204).send();


}


module.exports = {
    listarContas,
    cadastrarConta,
    atualizarConta,
    excluirConta

}
