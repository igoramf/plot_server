const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const dbMiddleware  = require('./middlewares/db_middleware.js');
const Plot = require('./models/plot.js');
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: process.env.CORS_ORIGIN } });

app.use(dbMiddleware);

app.get('/', (req, res) => {
    res.send('<h1>Hello Property Extractor</h1>');
});

app.use(express.static(__dirname + '/public'));

app.post('/create-plot', async (req, res) => {
    const plotId = uuidv4();
    plotAcc = null
    plotLoss = null
    try {
        const newPlot = new Plot({ plotId, plotAcc, plotLoss });
        await newPlot.save();
        const url = `${req.protocol}://${req.get('host')}/plot/${plotId}`;
        res.status(201).json({ id: plotId, url });
      } catch (error) {
        res.status(500).json({ error: 'Erro ao criar o plot' });
      }
});

app.get('/plot/:id', async(req, res) => {
    const id = req.params.id;
    try {
      const plot = await Plot.findOne({ plotId: id });
      if (plot) {
        res.sendFile(__dirname + '/public/index.html');
      } else {
        res.status(404).send('<h1>ID not found</h1>');
      }
    } catch (error) {
      res.status(500).send('<h1>Error</h1>');
    }
});

app.get('data/plot/:id', async (req, res) => { 
    const id = req.params.id;
    try {
      const plot = await Plot.findOne({ plotId: id });
      if (plot) {
        res.status(200).json(plot)
      } else {
        res.status(404).send('<h1>ID not found</h1>');
      }
    } catch (error) {
      res.status(500).send('<h1>Server Error</h1>');
    }
});

app.put('/update-plot/:id', async (req, res) => {
    const id = req.params.id;
    const { plotAcc, plotLoss } = req.body;
  
    try {
      const plot = await Plot.findOneAndUpdate(
        { plotId: id },
        { $set: { plotAcc, plotLoss } },
        { new: true }
      );
  
      if (plot) {
        res.json(plot);
      } else {
        res.status(404).json({ error: 'Plot not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Server Error' });
    }
});

app.delete('/delete-room/:id', async (req, res) => {
    const id = req.params.id;

    try {
      const plot = await Plot.findOne({ plotId: id });
      if (plot) {
        await plot.remove();
        io.of('/').in(id).disconnectSockets();
        res.status(200).json({ message: `ID ${id} deletado com sucesso` });
      } else {
        res.status(404).json({ error: `ID ${id} não encontrado` });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar o plot' });
    }
});

io.on('connection', (socket) => {
    console.log('Novo cliente conectado');
    
    socket.on('join_room', async (roomId) => {
        try {
            const plot = await Plot.findOne({ plotId: roomId });
            if (plot) {
              socket.join(roomId);
              console.log(`Cliente entrou na sala ${roomId}`);
            } else {
              console.log(`Tentativa de entrar em sala inválida: ${roomId}`);
            }
          } catch (error) {
            console.error(`Erro ao verificar sala no banco de dados: ${error}`);
          }
    });
    
    socket.on('training_data', async (data) => {
        if (data.id){
            const plot = await Plot.findOne({ plotId: data.id });
            const { train_acc, val_acc, loss, val_loss, max_epochs, id } = data;
            if (plot){
                plot.trainAcc = train_acc;
                plot.valAcc = val_acc;
                plot.loss = loss;
                plot.val_loss = val_loss;
                plot.maxEpochs = max_epochs;
                await plot.save();
            }
            io.to(data.id).emit('update_chart', data );
        }
    });

});

server.listen(process.env.PORT || 3000, () => {
    console.log(`server running at ${process.env.PORT}`);
});