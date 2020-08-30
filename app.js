import express from 'express';
import mongoose from 'mongoose';
import {clientRouter} from './routes/clientRouter.js';

//global.fileName = "accounts.json";

const app = express();

(async () => {
    try {
        await mongoose.connect(
            'urlbanco',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        console.log('Conectado ao MongoDB Atlas');
    } catch (error) {
        console.log('Erro ao conectar do MongoDB Atlas' + error);
    }
})();

app.use(express.json());
app.use(clientRouter);

app.listen(3000, () => console.log('API em execução'));