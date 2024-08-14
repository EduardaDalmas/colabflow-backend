const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

module.exports = function (app, socketPort) {
    const server = http.createServer(app);
    const io = socketIo(server, {
      cors: {
        origin: 'http://localhost:5174',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
        console.log('Usuário conectado', socket.id);

        socket.on('disconnect', (reason) => {
          console.log('Usuário desconectado', socket.id);
        });

        socket.on('set_username', (username) => {
          socket.data.username = username;
        });

        socket.on('message', (text) => {
            console.log('aqui', text);
            io.emit('received_message', {
              text,
              authorId: socket.id,
              author: socket.data.username,
            });
        });
    });

    server.listen(socketPort, () => {
        console.log(`WebSocket server is running on port ${socketPort}`);
    });
};
