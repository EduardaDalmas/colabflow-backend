const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

module.exports = function (app, socketPort) {
    const server = http.createServer(app);
    const io = socketIo(server, {
      cors: {
        origin: 'http://localhost:5173',
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
            //desconecta da sala antiga
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

        socket.on('message', (messageData) => {
            const room = socket.data.room;
            if (room) {
              const message = {
                authorId: messageData.authorId,
                author: messageData.author,
                text: messageData.text,
                data: messageData.data,
            };
                
                // Armazenar a mensagem no histórico da sala
                messagesByRoom[room].push(message);

                // Emitir a mensagem para todos os usuários na sala
                io.to(room).emit('received_message', message);
            } else {
                console.log('Erro: o usuário não está em nenhuma sala');
            }
        });
    });

    server.listen(socketPort, () => {
        console.log(`WebSocket server is running on port ${socketPort}`);
    });
};
