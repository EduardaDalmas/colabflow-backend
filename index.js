require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes/index');
const chatSocket = require('./socket/chatSocket');
const db = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');



const port = process.env.PORT || 3000;
const socketPort = process.env.SOCKET_PORT || 3001;

// Middleware para parsing de JSON
app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// lista de origens permitidas
const whitelist = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001', 'http://colabflow.westus2.cloudapp.azure.com', 'https://colabflow.westus2.cloudapp.azure.com'];

app.use(bodyParser.json());
app.use(cors({
  origin: whitelist, // URL do frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Usar as rotas
app.use('/api', routes);

// Inicializar o WebSocket
chatSocket(app, socketPort);

// Iniciar o servidor HTTP (separado do WebSocket)
app.listen(port, () => {
    console.log(`HTTP server is running on port ${port}`);
});
