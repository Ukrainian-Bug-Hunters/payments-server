import express from 'express';
import cors from 'cors';
import payments from './payments.js';
import { v4 as uuidv4} from 'uuid';

import paymentValidator from './PaymentValidator.js';

const server = express();

server.use(express.json());
server.use(cors());

function validatePaymentDataMiddleWare(req, res, next) {
    const payment = {...req.body};

    const errors = paymentValidator.validate(payment);
    if(errors.length > 0) {
        res.status(400).send(errors);
        next("Payment validation has failed");
    }
    
    next();
};
    
server.get('/payments', (req, res) => {
    res.status(200).send(payments);
});

server.get('/payments/:id', (req, res) => {
    const payment = payments.find(payment => payment.id === req.params.id);
    if(payment){
        res.status(200).send(payment);
        return;
    }
    res.status(404).send({message: 'Wrong id'});
});

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

server.put('/payments/:id', (req, res) => {
    const payment = payments.find( payment => payment.id === req.params.id);
    if(!payment){
        res.status(404).send('Could not find payment with this ID');
        return;
    }

    if(!req.body.description){
        res.status(404).send('Wrong description');
        return;
    }

    payment.description = req.body.description;
    res.status(200).send(payment);
});

server.delete('/payments/:id', (req, res) => {
    const paymentIdx = payments.findIndex(payment => payment.id === req.params.id);
    payments.splice(paymentIdx, 1);
    res.status(200).send();
});

server.listen(4000, function() {
    console.log(`Server is running on port ${this.address().port}`);
});