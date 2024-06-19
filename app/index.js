const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: process.env.CORS_ORIGIN } });

let validIds = [];

app.get('/', (req, res) => {
    res.send('<h1>Hello Property Extractor</h1>');
});

app.use(express.static(__dirname + '/public'));

app.get('/get-id', (req, res) => {
    const uniqueId = uuidv4();
    validIds.push(uniqueId);
    const url = `${req.protocol}://${req.get('host')}/page/${uniqueId}`;
    res.json({ id: uniqueId, url });
});

app.get('/page/:id', (req, res) => {
    const id = req.params.id;
    if (validIds.includes(id)) {
        res.sendFile(__dirname + '/public/index.html');
    } else {
        res.status(404).send('<h1>ID not found</h1>');
    }
});

app.delete('/delete-room/:id', (req, res) => {
    const id = req.params.id;
    const index = validIds.indexOf(id);
    if (index !== -1) {
        validIds.splice(index, 1);
        io.of('/').in(id).disconnectSockets()
        res.status(200).json({ message: `ID ${id} deleted successfully` });
    } else {
        res.status(404).json({ error: `ID ${id} not found` });
    }
});

io.on('connection', (socket) => {
    console.log('Novo cliente conectado');
    
    socket.on('join_room', (roomId) => {
        if (validIds.includes(roomId)) {
            socket.join(roomId);
            console.log(`Cliente entrou na sala ${roomId}`);
        } else {
            console.log(`Tentativa de entrar em sala inválida: ${roomId}`);
        }
    });
    
    socket.on('training_data', (data) => {
        if (data.id){
            io.to(data.id).emit('update_chart', data );
        }
    });

});

server.listen(process.env.PORT || 3000, () => {
    console.log(`server running at ${process.env.PORT}`);
});