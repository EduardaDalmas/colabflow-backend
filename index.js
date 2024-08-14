require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes/index');
const chatSocket = require('./socket/chatSocket');

const port = process.env.PORT || 3000;
const socketPort = process.env.SOCKET_PORT || 3001;

// Middleware para parsing de JSON
app.use(express.json());

// Usar as rotas
app.use('/api', routes);

// Inicializar o WebSocket
chatSocket(app, socketPort);

// Iniciar o servidor HTTP (separado do WebSocket)
app.listen(port, () => {
    console.log(`HTTP server is running on port ${port}`);
});
