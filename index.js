require('dotenv').config(); // Carregar variáveis de ambiente do .env

const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // Usar a variável do .env, com fallback

// Importar as rotas
const routes = require('./routes/index');

// Criar o servidor HTTP
const server = http.createServer(app);

// Importar e configurar o WebSocket
const chatSocket = require('./socket/chatSocket');
chatSocket(server);

// Middleware para parsing de JSON
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Usar as rotas
app.use('/api', routes);

// Iniciar o servidor
server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
