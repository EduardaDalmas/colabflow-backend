const { encryptMessage } = require('../utils/cryptoUtils');
const { decryptMessage } = require('../utils/cryptoUtils');
const db = require('../config/db');

const prepareMessage = (message) => {

    //criptografar o conteudo da mensagem
    const encryptedText = encryptMessage(message.text);
    return { ...message, text: encryptedText };

};

const decryptMessages = (message) => {
    //descriptografar o conteudo da mensagem
    const decryptedText = decryptMessage(message.text);
    return { ...message, text: decryptedText };
};


// recupera todas as mensagens de um chat e retorna descriptografadas
// const getMessages = (chatName, userName) => {
//     return new Promise((resolve, reject) => {
//         // Primeiro, busque o id do usuário pelo nome
//         db.query('SELECT id FROM `users` WHERE name = ?', [userName], (err, userResult) => {
//             if (err) {
//                 console.error('Erro ao buscar id do usuário:', err);
//                 return reject(err);
//             }
//             if (userResult.length === 0) {
//                 console.error('Usuário não encontrado');
//                 return reject(new Error('Usuário não encontrado'));
//             }

//             const userId = userResult[0].id; // Pegue o id do usuário encontrado

//             // Em seguida, busque o id do chat pelo nome
//             db.query('SELECT id FROM `chats` WHERE name = ?', [chatName], (err, chatResult) => {
//                 if (err) {
//                     console.error('Erro ao buscar id do chat:', err);
//                     return reject(err);
//                 }
//                 if (chatResult.length === 0) {
//                     console.error('Chat não encontrado');
//                     return reject(new Error('Chat não encontrado'));
//                 }

//                 const chatId = chatResult[0].id; // Pegue o id do chat encontrado

//                 // Agora, busque as mensagens usando o chatId e userId
//                 db.query('SELECT * FROM `messages` WHERE id_chat = ? AND id_user = ?', [chatId, userId], (err, messageResult) => {
//                     if (err) {
//                         console.error('Erro ao buscar mensagens:', err);
//                         return reject(err);
//                     }

//                     // Descriptografar as mensagens
//                     const decryptedMessages = messageResult.map((message) => {
//                         return {
//                             ...message,
//                             text: decryptMessage(message.message), // Supondo que o texto criptografado está na coluna "text"
//                         };
//                     });
//                     console.log('Mensagens descriptografadas:', decryptedMessages);
//                     resolve(decryptedMessages); // Resolva com as mensagens descriptografadas
//                 });
//             });
//         });
//     });
// };

const getMessages = (chatName, userName) => {
    return new Promise((resolve, reject) => {

        const query = `
        SELECT m.id, m.id_chat, m.id_user, m.message, m.created_at,
               u.name AS author, u.photo AS photo
        FROM messages m
        JOIN users u ON m.id_user = u.id
        WHERE m.id_chat = (SELECT id FROM chats WHERE name = ?)
    `;
    

        db.query(query, [chatName, userName], (err, result) => {
            if (err) {
                console.error('Erro ao buscar mensagens:', err);
                reject(err);
            } else {

                // update na tabela notification_reads para marcar as mensagens como lidas ao entrar no chat de acordo com o usuario
                const query = `
                UPDATE notification_reads 
                SET read_at = NOW()
                WHERE user_id = (SELECT id FROM users WHERE name = ?)
                  AND notification_id IN (
                    SELECT n.id 
                    FROM notifications n
                    JOIN chats c ON n.chat_id = c.id
                    JOIN messages m ON n.message_id = m.id
                    WHERE c.name = ?
                      AND m.id_chat = c.id
                  );
                `;
                db.query(query, [userName, chatName], (err, result) => {
                    if (err) {
                        console.error('Erro ao atualizar notificações:', err);
                    }
                }
                );
            


                // Mapeando o resultado para o formato desejado
                const formattedMessages = result.map((message) => {
                    const decryptedMessage = decryptMessage(message.message); // Descriptografando a mensagem
                    const localDate = new Date(message.created_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).replace(',', '');

                    return {
                        authorId: message.id_user, // ID do autor (ou mapeie conforme necessário)
                        author: message.author,     // Nome do autor
                        text: decryptedMessage,      // Texto descriptografado
                        // data: message.created_at.toISOString().slice(0, 19).replace('T', ' '), // Formatação da data
                        //formata a data removendo a virgula
                        data: localDate, // Formatação da data
                        room: chatName,               // Nome da sala
                        photo: message.photo
                    
                    };
                });
                resolve(formattedMessages);
            }
        });
    });
};






module.exports = { prepareMessage, decryptMessages, getMessages };