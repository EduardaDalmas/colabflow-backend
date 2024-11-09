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
        db.query('SELECT id, id_priority FROM `chats` WHERE name = ?', [message.room], (err, result) => {
            if (err) {
                console.error('Erro ao buscar id do chat:', err);
                return;
            }
            if (result.length === 0) {
                console.error('Chat não encontrado');
                return;
            }

            const chatId = result[0].id;
            const chatPriority = result[0].id_priority;

            // Inserir a mensagem no banco de dados com o id do chat e o id do autor
            db.query(
                'INSERT INTO `messages` (id_chat, id_user, message) VALUES (?, ?, ?)',
                [chatId, authorId, message.text],
                (err, result) => {
                    if (err) {
                        console.error('Erro ao salvar mensagem:', err);
                    } else {
                        console.log('Mensagem salva com sucesso');

                        // Obter o ID da mensagem inserida
                        const messageId = result.insertId;

                        // Se a prioridade do chat for 1 (urgente) ou 2 (alta), registrar a notificação
                        if (chatPriority === 1 || chatPriority === 2) {
                            db.query(
                                'INSERT INTO `notifications` (message_id, chat_id) VALUES (?, ?)',
                                [messageId, chatId],
                                (err) => {
                                    if (err) {
                                        console.error('Erro ao salvar notificação:', err);
                                    } else {
                                        console.log('Notificação salva com sucesso');
                                    }
                                }
                            );
                        }
                    }
                }
            );
        });
    });
};

module.exports = { persistMessage };