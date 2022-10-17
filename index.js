import express from 'express';
import cors from 'cors';
import payments from './payments.js';
import { v4 as uuidv4} from 'uuid';
import currencies from './currencies.js'

const server = express();

server.use(express.json());
server.use(cors());

server.get('/payments', (req, res) => {
    res.status(200).send(payments);
});

function validatePaymentDataMiddleWare(req, res, next) {
    const payment = {...req.body};
    const currentDate = new Date().toLocaleDateString('fr-CA');
    
    if(!(payment.date >= currentDate &&
        currencies.includes(payment.currency) &&
        Number.isFinite(payment.amount) && 
        Number.isFinite(payment.exchangeRate) &&
        payment.description &&
        payment.description !== '')) {
            return res.status(400).send('Invalid Data');
        };
        
    next();
};

server.post('/payments', validatePaymentDataMiddleWare, (req, res) => {
    const payment = {...req.body};

    Object.assign(payment, {
        id: uuidv4(),
        status: 'Pending'
    });
    payments.push(payment);
    res.status(200).send(payment);

    setTimeout(function() {
        payment.status = 'Completed'
    }, 10000);
});

server.listen(4000, function() {
    console.log(`Server is running on port ${this.address().port}`);
});