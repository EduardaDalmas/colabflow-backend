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
        db.query('SELECT id, id_priority, id_user FROM `chats` WHERE name = ?', [message.room], (err, result) => {
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
            const chatOwner = result[0].id_user;

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
                            // Inserir na tabela notifications
                            db.query(
                                'INSERT INTO `notifications` (message_id, chat_id) VALUES (?, ?)',
                                [messageId, chatId],
                                (err, results) => {
                                    if (err) {
                                        console.error('Erro ao salvar notificação:', err);
                                    } else {
                                        console.log('Notificação salva com sucesso');
                                        
                                        // Obter o ID da notificação recém-criada
                                        const notificationId = results.insertId;
                        
                                        // Buscar os usuários do chat
                                        db.query(
                                            'SELECT id_user FROM user_chat WHERE id_chat = ?',
                                            [chatId],
                                            (err, users) => {
                                                if (err) {
                                                    console.error('Erro ao buscar usuários do chat:', err);
                                                } else {

                                                    //só inserir se houver usuários no chat
                                                    if (users.length === 0) {
                                                        console.log('Nenhum usuário encontrado no chat');
                                                    }
                                                    else{
                                                    // Inserir em notification_reads para cada usuário
                                                    const values = users.map(user => [notificationId, user.id_user]);
                                                    db.query(
                                                        'INSERT INTO `notification_reads` (notification_id, user_id) VALUES ?',
                                                        [values],
                                                        (err) => {
                                                            if (err) {
                                                                console.error('Erro ao salvar leitura inicial de notificações:', err);
                                                            } else {
                                                                console.log('Leituras iniciais de notificações salvas com sucesso');
                                                            }
                                                        }
                                                    );
                                                    

                                                    // inserir em notification_reads para o dono do chat
                                                    db.query(
                                                        'INSERT INTO `notification_reads` (notification_id, user_id) VALUES (?, ?)',
                                                        [notificationId, chatOwner],
                                                        (err) => {
                                                            if (err) {
                                                                console.error('Erro ao salvar leitura inicial de notificações:', err);
                                                            } else {
                                                                console.log('Leituras iniciais de notificações salvas com sucesso');
                                                            }
                                                        }
                                                    );




                                                    }
                     
                                                }
                                            }
                                        );
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