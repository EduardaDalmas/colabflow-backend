// controllers/UserController.js

exports.getAllUsers = (req, res) => {
    // Exemplo de dados de usuários
    const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
    ];
    res.json(users);
};
  
exports.getUserById = (req, res) => {
    const userId = req.params.id;
    // Exemplo de busca por ID (em uma aplicação real, seria uma consulta ao banco de dados)
    const user = { id: userId, name: 'Alice' };
    res.json(user);
};
  
exports.createUser = (req, res) => {
    const newUser = req.body;
    // Aqui você salvaria o novo usuário no banco de dados
    res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser });
};
