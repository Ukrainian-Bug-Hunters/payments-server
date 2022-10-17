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

function validatePaymentData (payment) {
    const currentDate = new Date().toLocaleDateString('fr-CA');
    if(payment.date >= currentDate &&
        currencies.includes(payment.currency) &&
        Number.isFinite(payment.amount) && 
        Number.isFinite(payment.exchangeRate) &&
        payment.description &&
        payment.description !== ''
    ) {
        return payment;
    }
    else {
        payment = null;
        return payment;
    }
};

server.post('/payments', (req, res) => {
    const payment = validatePaymentData({...req.body});
    if(payment) {
        Object.assign(payment, {
            id: uuidv4(),
            status: 'Pending'
        });

        payments.push(payment);
        res.status(200).send(payment);

        setTimeout(function() {
            payment.status = 'Completed'
        }, 10000);
    }
    else {
        res.status(404).send('Not Found')
    }
});

server.listen(4000, function() {
    console.log(`Server is running on port ${this.address().port}`);
});