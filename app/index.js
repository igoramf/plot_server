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
    res.json({ id: uniqueId });
});

app.get('/page/:id', (req, res) => {
    const id = req.params.id;
    if (validIds.includes(id)) {
        res.sendFile(__dirname + '/public/index.html');
    } else {
        res.status(404).send('<h1>ID not found</h1>');
    }
});


io.on('connection', (socket) => {
    console.log('Novo cliente conectado');
    socket.on('training_data', (data) => {
        console.log('Dados de treinamento recebidos:', data);
        if (data.id) {
            io.emit('update_chart', { data });
        }
    });

    socket.on('send_plots', (data) => {
        const { accPlot, lossPlot } = data;

        socket.emit('image_data', { accPlot, lossPlot });
    });

});

console.log("CORS", process.env.CORS_ORIGIN)
url = `http://localhost:${process.env.PORT}`;

server.listen(process.env.PORT || 3000, () => {
    console.log(`server running at http://localhost:${process.env.PORT}`);
});