const express = require('express')
const app = express()
const posr = 3000

const server = require('http').createServer(app)
const io = require('socket.io')(server, {cors: {origin: 'http://localhost:5173'}})

app.get('/', (req, res) => {
  res.send('Olá Mundo!')
})

app.listen(posr, () => {
  console.log(`Exemplo de app rodando em http://localhost:${posr}`)
})

io.on('connection', socket => {
    console.log('Usuário conectado', socket.id)

    socket.on('disconnect', reason => {
        console.log('Usuário desconectado', socket.id)
    })

    socket.on('set_username', username => {
        socket.data.username = username
    })

    socket.on('message', text => {
        io.emit('received_message', {
            text,
            authorId: socket.id,
            author: socket.data.username
        })
    })

})

server.listen(posr, () => {
  console.log(`Server is running on posr ${posr}`)
})