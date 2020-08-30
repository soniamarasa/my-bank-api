//1. Procedimento feito em clientRouter e app.js(vide  parte comentada)
//2. Feito em clienteModel.js

import { clientModel } from '../models/clientModel.js';

//3. Crianção do projeto my-bank-api -> Feito.

//4.
const deposito = async (req, res) => {
  try {
    let operacao = req.body;
    const { agencia, conta, valor } = operacao;

    if (!agencia || !conta || !valor) {
      throw new Error('Agência, conta e valor são obrigatórios');
    }

    const contaExistente = await clientModel.find({
      $and: [{ agencia: agencia }, { conta: conta }],
    });
    if (contaExistente.length === 0) {
      throw new Error('Conta Inexistente');
    }

    const cliente = await clientModel.findOneAndUpdate(
      { $and: [{ agencia: agencia }, { conta: conta }] },
      { $set: { balance: contaExistente[0].balance + parseFloat(valor) } },
      { new: true }
    );

    res.send('Saldo atual: ' + cliente.balance);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//5.
const saque = async (req, res) => {
  try {
    let operacao = req.body;
    const { agencia, conta, balance } = operacao;

    if (!agencia || !conta || !balance) {
      throw new Error('Agência, conta e balance são obrigatórios');
    }

    const contaExistente = await clientModel.find({
      $and: [{ agencia: agencia }, { conta: conta }],
    });
    if (contaExistente.length === 0) {
      throw new Error('Conta Inexistente');
    } else if (contaExistente[0].balance - (balance + 1) < 0) {
      throw new Error('Operação impossível devido a falta de saldo');
    }

    const cliente = await clientModel.findOneAndUpdate(
      { $and: [{ agencia: agencia }, { conta: conta }] },
      { $set: { balance: contaExistente[0].balance - (balance + 1) } },
      { new: true }
    );

    res.send('Saldo atual: ' + cliente.balance);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//6.
const saldo = async (req, res) => {
  try {
    let operacao = req.params;
    const { agencia, conta } = operacao;

    if (!agencia || !conta) {
      throw new Error('Agência, conta são obrigatórios');
    }

    const contaExistente = await clientModel.find({
      $and: [{ agencia: agencia }, { conta: conta }],
    });
    if (contaExistente.length === 0) {
      throw new Error('Conta Inexistente');
    }

    res.send('Saldo atual: ' + contaExistente[0].balance);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//7.
const excluirConta = async (req, res) => {
  try {
    let operacao = req.params;
    const { agencia, conta } = operacao;

    if (!agencia || !conta) {
      throw new Error('Agência e conta são obrigatórios');
    }

    const contaExistente = await clientModel.find({
      $and: [{ agencia: agencia }, { conta: conta }],
    });
    if (contaExistente.length === 0) {
      throw new Error('Conta Inexistente');
    }

    await clientModel.findOneAndDelete({
      $and: [{ agencia: agencia }, { conta: conta }],
    });

    const contasAtivas = await clientModel.find({ agencia: agencia });

    res.send('Contas ativas na agência: ' + contasAtivas.length);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// 8.
const transferencias = async (req, res) => {
  try {
    let operacao = req.params;
    const { contaDeOrigem, contaDeDestino, value } = operacao;

    const transferMontante = parseFloat(value);

    if (!contaDeOrigem || !contaDeDestino || !value) {
      throw new Error('Conta de origem e destino e valor são obrigatórios');
    }

    const checandoContaOrigem = await clientModel.find({
      conta: contaDeOrigem,
    });

    const checandoContaDestino = await clientModel.find({
      conta: contaDeDestino,
    });

    if (checandoContaOrigem.length === 0 || checandoContaDestino.length === 0) {
      throw new Error('Conta de origem e/ou destino inexistente');
    }

    let clienteDeOrigem = null;
    if (checandoContaOrigem[0].agencia === checandoContaDestino[0].agencia) {
      if (checandoContaOrigem[0].balance - transferMontante < 0) {
        throw new Error('Operação impossível devido a falta de saldo');
      }
      clienteDeOrigem = await clientModel.findOneAndUpdate(
        {
          $and: [
            { agencia: checandoContaOrigem[0].agencia },
            { conta: contaDeOrigem },
          ],
        },
        {
          $set: { balance: checandoContaOrigem[0].balance - transferMontante },
        },
        { new: true }
      );
      await clientModel.findOneAndUpdate(
        {
          $and: [
            { agencia: checandoContaDestino[0].agencia },
            { conta: contaDeDestino },
          ],
        },
        {
          $set: { balance: checandoContaDestino[0].balance + transferMontante },
        },
        { new: true }
      );
    } else {
      if (checandoContaOrigem[0].balance - (transferMontante + 8) < 0) {
        throw new Error('Operação impossível devido à falta de saldo');
      }
      clienteDeOrigem = await clientModel.findOneAndUpdate(
        {
          $and: [
            { agencia: checandoContaOrigem[0].agencia },
            { conta: contaDeOrigem },
          ],
        },
        {
          $set: {
            balance: checandoContaOrigem[0].balance - (transferMontante + 8),
          },
        },
        { new: true }
      );
      await clientModel.findOneAndUpdate(
        {
          $and: [
            { agencia: checandoContaDestino[0].agencia },
            { conta: contaDeDestino },
          ],
        },
        {
          $set: { balance: checandoContaDestino[0].balance + transferMontante },
        },
        { new: true }
      );
    }
    res.send('Saldo atual: ' + clienteDeOrigem.balance);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// 9.
const mediaSaldo = async (req, res) => {
  try {
    let operacao = req.params;
    const { agencia } = operacao;

    if (!agencia) {
      throw new Error('Agência é obrigatória');
    }

    const contasdaAgencia = await clientModel.find({ agencia: agencia });
    if (contasdaAgencia.length === 0) {
      throw new Error('Agência Inexistente');
    }

    const totalBalance = contasdaAgencia.reduce((acc, curr) => {
      return acc + curr.balance;
    }, 0);

    const saldoMedio = totalBalance / contasdaAgencia.length;

    res.send('Saldo médio da agência ' + agencia + ': ' + saldoMedio);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// 10.
const clientesMenorSaldo = async (req, res) => {
  try {
    let operacao = req.params;
    const { qtd } = operacao;

    if (!qtd) {
      throw new Error('A quantidade de clientes é obrigatória');
    }

    const clientes = (await clientModel.find({}, { _id: 0, __v: 0, name: 0 }))
      .sort((a, b) => a.balance - b.balance)
      .slice(0, +qtd);

    res.send(clientes);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// 11.
const clientesMaiorSaldo = async (req, res) => {
  try {
    let operacao = req.params;
    const { qtd } = operacao;

    if (!qtd) {
      throw new Error('A quantidade de clientes é obrigatória');
    }

    const clientes = (await clientModel.find({}, { _id: 0, __v: 0 }))
      .sort((a, b) => b.balance - a.balance || a.name.localeCompare(b.name))
      .slice(0, +qtd);

    res.send(clientes);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

//12.
const transfAgPrivada = async (_, res) => {
  try {
    let clientesClasseA = [];
    let agenciaAtual = [];
    const clientes = await clientModel.find({});

    let ordClientes = Object.assign([], clientes);
    ordClientes = ordClientes.sort((a, b) => b.balance - a.balance);

    ordClientes.forEach((clienteClasseA) => {
      if (agenciaAtual.includes(clienteClasseA.agencia)) {
        return;
      } else {
        agenciaAtual.push(clienteClasseA.agencia);
        clientesClasseA.push(clienteClasseA);
      }
    });

    clientesClasseA.forEach(async (cliente) => {
      await clientModel.findOneAndUpdate(
        { $and: [{ agencia: cliente.agencia }, { conta: cliente.conta }] },
        { $set: { agencia: 99 } }
      );
    });

    const clientesPrivados = await clientModel.find({ agencia: 99 });

    res.send(clientesPrivados);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export default {
  deposito,
  saque,
  saldo,
  excluirConta,
  transferencias,
  mediaSaldo,
  clientesMenorSaldo,
  clientesMaiorSaldo,
  transfAgPrivada,
};
