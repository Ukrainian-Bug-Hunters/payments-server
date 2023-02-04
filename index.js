import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import paymentValidator from "./PaymentValidator.js";
import { createServer } from "http";
import { Server } from "socket.io";
import paymentsIn from "./data/payments-in.js";
import paymentsOut from "./data/payments-out.js";
import { calculateTotalhomeAmount } from "./helper/Balance.js";
import { connectDb, disconnectDb } from "./db.js";

const SERVER_PORT = process.env.PORT || 4000;
const SOCKET_PORT = process.env.SOCKET_PORT || 5000;

const server = express();
server.use(express.json());
server.use(cors());

const socketServer = createServer(server);
const ioServer = new Server(socketServer, {
  cors: { origin: "*" },
});

ioServer.on("connection", (socket) => {
  console.log(`a user connected with id: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`user with id ${socket.id} has just disconnected`);
  });
});

function validatePaymentDataMiddleWare(req, res, next) {
    const payment = {...req.body};
    const errors = paymentValidator.validate(payment);

    if(errors.length > 0) {
        res.status(400).send({'errors': errors});
        next("Payment validation has failed");
    }

    next();
};

server.get('/balance', (req, res) => {
    const balance = {
        amount: calculateTotalhomeAmount(paymentsIn),
        currency: 'GBP',
        currencySymbol: '\u00A3'
    };
    
    res.status(200).send(balance);
});

server.get('/payments', (req, res) => {
    res.status(200).send(paymentsOut);
});

server.post("/payments", validatePaymentDataMiddleWare, (req, res) => {
  const payment = { ...req.body };
  Object.assign(payment, {
    id: uuidv4(),
    status: "Pending",
  });

  paymentsOut.push(payment);
  res.status(200).send();

  const data = {
    action: "created",
    payment: payment,
  };

  ioServer.sockets.emit("payments", data);

  setTimeout(() => {
    payment.status = "Completed";

    const data = {
      action: "updated",
      payment: payment,
    };

    ioServer.sockets.emit("payments", data);
  }, 10 * 1000 + 15 * Math.random() * 1000);
  // wait a random number of seconds between 10 and 10+15=25 seconds.
});


server.put("/payments/:id", (req, res) => {
  const payment = paymentsOut.find((payment) => payment.id === req.params.id);
  if (!payment) {
    res.status(404).send("Could not find payment with this ID");
    return;
  }

  if (!req.body.description) {
    res.status(404).send("Wrong description");
    return;
  }

  payment.description = req.body.description;
  res.status(200).send();

  const data = {
    action: "updated",
    payment: payment,
  };

  ioServer.sockets.emit("payments", data);
});

server.put('/payments/cancel/:id', (req, res) => {
  const payment = paymentsOut.find( payment => payment.id === req.params.id);
  if(!payment){
      res.status(404).send('Could not find payment with this ID');
      return;
  }
  
  if(payment.status === 'Complete') {
      res.status(409).send('Payment has been already completed!');
      return;
  }
  
  payment.status = 'Cancelled';
  res.status(200).send();

  const data = {
    action: "updated",
    payment: payment,
  };

  ioServer.sockets.emit("payments", data);
});

server.delete("/payments/:id", (req, res) => {
  const paymentIdx = paymentsOut.findIndex(
    (payment) => payment.id === req.params.id
  );

  const payment = paymentsOut.splice(paymentIdx, 1).pop();
  res.status(200).send();

  const data = {
    action: "deleted",
    payment: payment,
  };

  ioServer.sockets.emit("payments", data);
});

socketServer.listen(SOCKET_PORT, "0.0.0.0", () => {
  console.log(`Socket server is running on port ${socketServer.address().port}`);
});

server.listen(SERVER_PORT, "0.0.0.0", function () {
  console.log(`Backend server is running on port ${this.address().port}`);
});



