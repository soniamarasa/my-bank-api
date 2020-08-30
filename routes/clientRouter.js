import express from 'express';
import clientController from '../controllers/clientController.js';

const app = express();

app.put('/clienteDeposito', clientController.deposito);

app.put('/clienteSaque', clientController.saque);

app.get('/cliente/:agencia/:conta', clientController.saldo);

app.delete('/clienteDeletar/:agencia/:conta', clientController.excluirConta);

app.put(
  '/clienteTransfer/:contaDeOrigem/:contaDeDestino/:value',
  clientController.transferencias
);

app.get('/mediaSaldo/:agencia', clientController.mediaSaldo);

app.get('/clientesMenorSaldo/:qtd', clientController.clientesMenorSaldo);

app.get('/clientesMaiorSaldo/:qtd', clientController.clientesMaiorSaldo);

app.get('/clientesprivados', clientController.transfAgPrivada);

export { app as clientRouter };

//import {clientModel} from '../models/clientModel.js';
//import {promises as fs} from 'fs';

/* app.get('/cliente', async (_, res) => {
    const clientes = JSON.parse(await fs.readFile(global.fileName))
    clientes.forEach(async (cliente) => {
        let clienteAtual = new clientModel(cliente);
        await clienteAtual.save()
    })
    res.send('Finalizado')
}) */
