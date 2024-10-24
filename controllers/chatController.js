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
  
  // Função para obter um chat específico por ID
  exports.getChatByGroupId = (req, res) => {
    const id_group = req.params.id;

    db.query('SELECT * FROM chats WHERE id_group = ?', [id_group], (err, results) => {
        if (err) {
            console.error('Erro ao buscar chats:', err);
            return res.status(500).send('Erro ao buscar chats');
        }
        if (results.length === 0) {
            return res.status(404).send('Chat não encontrado');
        }

        // Mapear os resultados para o formato esperado (id, name)
        const formattedResults = results.map(chat => ({
            id: chat.id,
            name: chat.name,
            id_user: chat.id_user,
            id_priority: chat.id_priority
        }));

        res.json(formattedResults);  // Retorna os perfis formatados
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
    const { id, id_priority } = req.body;

    db.query('UPDATE `chats` SET id_priority = ? WHERE id = ?', [id_priority, id], (err, result) => {
        if (err) {
            console.error('Erro ao editar chat:', err);
            return res.status(500).send('Erro ao editar chat');
        }
        res.status(200).send('Chat editado com sucesso');
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
          res.status(201).send('Usuário adicionado ao chat com sucesso');
      });
  });
};


