require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/index');
const chatSocket = require('./socket/chatSocket');

const app = express();
const port = process.env.PORT || 3000;
const socketPort = process.env.SOCKET_PORT || 3001;

// Caminho para os arquivos de certificado e chave
const keyPath = '/etc/letsencrypt/live/colabflow.eastus.cloudapp.azure.com/privkey.pem';
const certPath = '/etc/letsencrypt/live/colabflow.eastus.cloudapp.azure.com/fullchain.pem';

// Ler os arquivos de certificado e chave
const privateKey = fs.readFileSync(keyPath, 'utf8');
const certificate = fs.readFileSync(certPath, 'utf8');

// Configuração das credenciais
const credentials = { key: privateKey, cert: certificate };

const allowedOrigins = ['http://localhost:3000', 'https://colabflow.eastus.cloudapp.azure.com', 'https://black-desert-0361fb10f.5.azurestaticapps.net'];

// Middleware para parsing de JSON e CORS
app.use(express.json());
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Usar as rotas
app.use('/api', routes);

// Inicializar o WebSocket
chatSocket(app, socketPort);

// Criar e iniciar o servidor HTTPS
https.createServer(credentials, app).listen(port, () => {
  console.log(`Servidor HTTPS rodando na porta ${port}`);
});
