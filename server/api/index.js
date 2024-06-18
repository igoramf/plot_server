const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid'); 
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {cors: {origin: process.env.CORS_ORIGIN } });

app.get('/', (req, res) => {
   res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
    console.log('Novo cliente conectado');
    const uniqueId = uuidv4();
    socket.on('training_data', (data) => {
        console.log('Dados de treinamento recebidos:', data);
        io.emit('update_chart', { id: uniqueId, ...data });
    });
});

console.log("CORS", process.env.CORS_ORIGIN )
url = `http://localhost:${process.env.PORT}`;

server.listen(process.env.PORT || 3000, () => {
   console.log(`server running at http://localhost:${process.env.PORT}`);
});