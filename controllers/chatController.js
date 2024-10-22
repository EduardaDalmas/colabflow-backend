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

    db.query('INSERT INTO chats (name, id_group, id_user, id_priority) VALUES (?, ?, ?, ?)', [name, id_group, id_user, id_priority], (err, result) => {
        if (err) {
            console.error('Erro ao criar chat:', err);
            return res.status(500).send('Erro ao criar chat');
        }
        res.status(201).send('Chat criado com sucesso');
    });
  };
  