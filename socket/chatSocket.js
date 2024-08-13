const socketIo = require('socket.io');

module.exports = function (server) {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('Novo cliente conectado');

    // Evento para receber mensagens de chat
    socket.on('message', (msg) => {
      console.log('Mensagem recebida:', msg);
      // Enviar a mensagem para todos os clientes conectados
      io.emit('message', msg);
    });

    // Evento para desconectar
    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
  });
};
