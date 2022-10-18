import express from 'express';
import cors from 'cors';
import payments from './payments.js';
import { v4 as uuidv4 } from 'uuid';

const server = express();

server.use(express.json());
server.use(cors());

server.get('/payments', (req, res) => {
    res.status(200).send(payments);
});

server.get('/payments/:id', (req, res) => {
    const payment = payments.find( payment => payment.id === req.params.id);
    if(payment){
        res.status(200).send(payment);
        return;
    }
    res.status(404).send({message: 'Wrong id'});
});

server.post('/payments', (req, res) => {
    const payment = {...req.body};
    Object.assign(payment, {
        id: uuidv4(),
        status: 'Pending'
    });
    payments.push(payment);
    res.status(200).send(payment);
});

server.put('/payments/:id', (req, res) => {
    const payment = payments.find( payment => payment.id === req.params.id);
    if(!payment || !req.body.description){
        res.status(404).send('Wrong description or server can not find payment with this ID');
        return;
    }
    payment.description = req.body.description;
    res.status(200).send(payment);
});

server.delete('/payments/:id', (req, res) => {
    const payment = payments.find( payment => payment.id === req.params.id);
    const paymentIdx = payments.indexOf(payment);
    payments.splice(paymentIdx, 1);
    res.status(200).send();
});

server.listen(4000, function() {
    console.log(`Server is running on port ${this.address().port}`);
});


