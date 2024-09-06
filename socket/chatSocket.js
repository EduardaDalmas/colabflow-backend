const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');

// Caminho para os arquivos de certificado e chave
const keyPath = '/etc/letsencrypt/live/colabflow.eastus.cloudapp.azure.com/privkey.pem';
const certPath = '/etc/letsencrypt/live/colabflow.eastus.cloudapp.azure.com/fullchain.pem';

// Ler os arquivos de certificado e chave
const privateKey = fs.readFileSync(keyPath, 'utf8');
const certificate = fs.readFileSync(certPath, 'utf8');

// Configuração das credenciais
const credentials = { key: privateKey, cert: certificate };

module.exports = function (app, socketPort) {
    // Criar o servidor HTTPS
    const server = https.createServer(credentials, app);
    const io = socketIo(server, {
        cors: {
            origin: 'https://black-desert-0361fb10f.5.azurestaticapps.net',
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type'],
            credentials: true,
        },
    });

    // Objeto para armazenar mensagens por sala
    const messagesByRoom = {};

    io.on('connection', (socket) => {
        console.log('Usuário conectado', socket.id);

        socket.on('disconnect', (reason) => {
            console.log('Usuário desconectado', socket.id);
        });

        socket.on('set_username', (username) => {
            socket.data.username = username;
        });

        socket.on('join_room', (room) => {
            socket.join(room);
            socket.data.room = room;
            // Desconecta da sala antiga
            if (socket.data.oldRoom) {
                socket.leave(socket.data.oldRoom);
            }
            console.log(`${socket.data.username} entrou na sala ${room}`);

            // Enviar o histórico de mensagens da sala para o usuário que acabou de entrar
            if (messagesByRoom[room]) {
                socket.emit('room_history', messagesByRoom[room]);
            } else {
                messagesByRoom[room] = [];  // Iniciar uma nova sala se ainda não existir
            }
        });

        // Leave room
        socket.on('leave_room', (room) => {
            socket.leave(room);
            socket.data.oldRoom = room;
            socket.data.room = null;
            console.log(`${socket.data.username} saiu da sala ${room}`);
        });

        socket.on('message', (messageData) => {
            const room = socket.data.room;
            const authRoom = messageData.room;
            console.log(room);
            console.log(authRoom);

            if (authRoom == room) {
                const message = {
                    authorId: messageData.authorId,
                    author: messageData.author,
                    text: messageData.text,
                    data: messageData.data,
                    room: room,
                };

                // Armazenar a mensagem no histórico da sala
                messagesByRoom[room].push(message);

                // Emitir a mensagem para todos os usuários na sala
                if (room == authRoom) {
                    io.to(room).emit('received_message', message);
                }
            } else {
                console.log('Erro: o usuário não está em nenhuma sala');
            }
        });
    });

    server.listen(socketPort, () => {
        console.log(`WebSocket server is running on port ${socketPort}`);
    });
};
