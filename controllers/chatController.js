// controllers/ChatController.js

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
  exports.getChatById = (req, res) => {
    const chatId = parseInt(req.params.id, 10);
    // Exemplo de busca por ID (em uma aplicação real, seria uma consulta ao banco de dados)
    const chat = { id: chatId, name: `Chat ${chatId}` };
    res.json(chat);
  };
  
  // Função para criar um novo chat
  exports.createChat = (req, res) => {
    const newChat = req.body;
    // Aqui você salvaria o novo chat no banco de dados
    res.status(201).json({ message: 'Chat criado com sucesso', chat: newChat });
  };
  