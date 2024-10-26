const db = require('../config/db');

const persistMessage = (message) => {
    // Buscar o id do autor pelo nome
    db.query('SELECT id FROM `users` WHERE name = ?', [message.author], (err, result) => {
        if (err) {
            console.error('Erro ao buscar id do autor:', err);
            return;
        }
        if (result.length === 0) {
            console.error('Autor não encontrado');
            return;
        }

        // Definir o id do autor na mensagem
        const authorId = result[0].id;

        // Buscar o id do chat
        db.query('SELECT id FROM `chats` WHERE name = ?', [message.room], (err, result) => {
            if (err) {
                console.error('Erro ao buscar id do chat:', err);
                return;
            }
            if (result.length === 0) {
                console.error('Chat não encontrado');
                return;
            }

            const chatId = result[0].id;

            // Inserir a mensagem no banco de dados com o id do chat e o id do autor
            db.query(
                'INSERT INTO `messages` (id_chat, id_user, message) VALUES (?, ?, ?)',
                [chatId, authorId, message.text],
                (err) => {
                    if (err) {
                        console.error('Erro ao salvar mensagem:', err);
                    } else {
                        console.log('Mensagem salva com sucesso');
                    }
                }
            );
        });
    });
};

module.exports = { persistMessage };