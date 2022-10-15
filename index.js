import express from 'express';
import cors from 'cors';
import payments from './payments.js';

const server = express();

server.use(express.json());
server.use(cors());

server.get('/payments', (req, res) => {
    res.status(200).send(payments);
});



server.listen(4000, function() {
    console.log(`Server is running on port ${this.address().port}`);
});



