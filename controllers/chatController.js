// controllers/ChatController.js
const db = require('../config/db');

// Função para obter todos os chats
exports.getAllChats = (req, res) => {
    // Exemplo de dados de chats
    const chats = [
      { id: 1, name: 'Chat 1' },
      { id: 2, name: 'Chat 2' },
    ];
    res.json(chats);
  };
  
// Função para obter um chat específico por ID do grupo e incluir chats onde o usuário é dono ou participante
exports.getChatByGroupId = (req, res) => {
  const id_group = req.params.id_group;
  const id_user = req.params.id_user; 

  const query = `
    SELECT DISTINCT c.id, c.name, c.id_user, c.id_priority 
    FROM chats c 
    LEFT JOIN user_chat uc ON c.id = uc.id_chat
    WHERE c.id_group = ? 
    AND (c.id_user = ? OR uc.id_user = ?);
  `;

  db.query(query, [id_group, id_user, id_user], async (err, results) => {
      if (err) {
          console.error('Erro ao buscar chats:', err);
          return res.status(500).send('Erro ao buscar chats');
      }
      if (results.length === 0) {
          return res.status(404).send('Chat não encontrado');
      }

        // Mapeia os resultados e cria uma lista de promessas para a contagem de notificações
        const resultsWithNotifications = await Promise.all(results.map(async (chat) => {
            const count = await new Promise((resolve, reject) => {
                const query = `SELECT COUNT(*) AS count FROM notifications WHERE chat_id = ? AND status = 'NOVA'`;
                db.query(query, [chat.id], (err, result) => {
                    if (err) return reject(err);
                    resolve(result[0].count);
                });
            });
            return {
                ...chat,
                notifications: count,
            };
        }));



        // Mapeia os resultados para o formato final
        const formattedResults = resultsWithNotifications.map(chat => ({
            id: chat.id,
            name: chat.name,
            id_user: chat.id_user,
            id_priority: chat.id_priority,
            notifications: chat.notifications,
        }));

      res.json(formattedResults);  // Retorna os resultados formatados
  });
};

  
  // Função para criar um novo chat
  exports.createChat = (req, res) => {
    const { name, id_group, id_user, id_priority } = req.body;

    db.query('INSERT INTO `chats` (name, id_group, id_user, id_priority) VALUES (?, ?, ?, ?)', [name, id_group, id_user, id_priority], (err, result) => {
        if (err) {
            console.error('Erro ao criar chat:', err);
            return res.status(500).send('Erro ao criar chat');
        }
        res.status(201).send('Chat criado com sucesso');
    });
  };


  // editar prioridade do chat
  exports.editChat = (req, res) => {
    const { id_user, name, id_priority, id_group, id_chat } = req.body;

    db.query('UPDATE `chats` SET id_user = ?, name = ?, id_priority = ?, id_group = ? WHERE id = ?', [id_user, name, id_priority, id_group, id_chat], (err, result) => {
        if (err) {
            console.error('Erro ao editar chat:', err);
            return res.status(500).send('Erro ao editar chat');
        }
        res.status(200).send('Chat editado com sucesso');
        console.log(res);
    });
  };


// busca participantes do chat
exports.getUsersChat = (req, res) => {
  const id_chat = req.params.id_chat;

  // Primeira consulta para obter os IDs dos participantes do chat
  db.query('SELECT id_user FROM `user_chat` WHERE id_chat = ?', [id_chat], (err, results) => {
      if (err) {
          console.error('Erro ao buscar participantes do chat:', err);
          return res.status(500).send('Erro ao buscar participantes do chat');
      }
      if (results.length === 0) {
          return res.status(404).send('Participantes do chat não encontrados');
      }

      // Extrair os IDs dos usuários dos resultados
      const userIds = results.map(result => result.id_user);

      // Segunda consulta para obter os nomes dos participantes
      db.query('SELECT id, name FROM `users` WHERE id IN (?)', [userIds], (err, userResults) => {
          if (err) {
              console.error('Erro ao buscar nomes dos participantes do chat:', err);
              return res.status(500).send('Erro ao buscar nomes dos participantes do chat');
          }

          // Mapear os resultados para o formato esperado (id_user e name)
          const formattedResults = userResults.map(user => ({
              id_user: user.id,
              name: user.name
          }));

          res.json(formattedResults);  // Retorna os perfis formatados
      });
  });
};


// adicionar participante ao chat
exports.createUserChat = (req, res) => {
  const { id_chat, email } = req.body;

  // Primeira consulta para obter o ID do usuário
  db.query('SELECT id FROM `users` WHERE email = ?', [email], (err, results) => {
      if (err) {
          console.error('Erro ao buscar usuário:', err);
          return res.status(500).send('Erro ao buscar usuário');
      }
      if (results.length === 0) {
          return res.status(404).send('Usuário não encontrado');
      }

      const id_user = results[0].id;

      // Segunda consulta para adicionar o usuário ao chat
      db.query('INSERT INTO `user_chat` (id_chat, id_user) VALUES (?, ?)', [id_chat, id_user], (err, result) => {
          if (err) {
              console.error('Erro ao adicionar usuário ao chat:', err);
              return res.status(500).send('Erro ao adicionar usuário ao chat');
          }
          res.status(200).send('Usuário adicionado com sucesso!');
      });
  });
};


//remover participante do chat
exports.deleteUserChat = (req, res) => {
    const id_chat = req.params.id_chat;
    const id_user = req.params.id_user;   
    console.log(id_chat);
    console.log(id_user);

      db.query('DELETE FROM `user_chat` WHERE id_chat = ? AND id_user = ?', [id_chat, id_user], (err, result) => {
          if (err) {
              console.error('Erro ao remover usuário do chat:', err);
              return res.status(500).send('Erro ao remover usuário do chat');
          }
          res.status(200).send('Usuário removido com sucesso!');
      });
};


