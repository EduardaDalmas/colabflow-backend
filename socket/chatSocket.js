const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { persistMessage } = require('../controllers/messageController'); // ajuste o caminho conforme necessário
const { prepareMessage } = require('../services/messageService');
const { decryptMessages } = require('../services/messageService');

module.exports = function (app, socketPort) {
    const server = http.createServer(app);
    const origins = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001', 'http://colabflow.westus2.cloudapp.azure.com', 'https://colabflow.westus2.cloudapp.azure.com'];
    const io = socketIo(server, {
      cors: {
        origin: origins,
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
                console.log('Histórico de mensagens enviado para o usuário que acabou de entrar');
            } else {
                messagesByRoom[room] = [];  // Iniciar uma nova sala se ainda não existir
            }
        });

        //leave room
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
            console.log('oi',authRoom);

            if (authRoom == room) {
            const message = {
                authorId: messageData.authorId,
                author: messageData.author,
                text: messageData.text,
                data: messageData.data,
                room: room,
            };
                      
                
                // Armazenar a mensagem no histórico da sala
                // messagesByRoom[room].push(message);

                // Emitir a mensagem para todos os usuários na sala


                //emite mensagem para apenas a sala atual
                if(room == authRoom){
                    io.to(room).emit('received_message', message);

                    // Preparar a mensagem antes de persistir, criptografando o texto
                    const preparedMessage = prepareMessage(message);
                    // Persistir a mensagem no banco de dados
                    persistMessage(preparedMessage);

                    //teste de descriptografia
                    decryptedMessage = decryptMessages(preparedMessage);

                    console.log('Mensagem descriptografada:', decryptedMessage);
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
