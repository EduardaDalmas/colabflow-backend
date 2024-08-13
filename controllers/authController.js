// controllers/AuthController.js

// Função para login
exports.login = (req, res) => {
    const { username, password } = req.body;
    // Exemplo de autenticação (em uma aplicação real, você verificaria o usuário no banco de dados)
    if (username === 'admin' && password === 'password') {
      res.json({ message: 'Login bem-sucedido', token: 'fake-jwt-token' });
    } else {
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  };
  
  // Função para registro
  exports.register = (req, res) => {
    const { username, password } = req.body;
    // Exemplo de registro (em uma aplicação real, você salvaria o usuário no banco de dados)
    res.status(201).json({ message: 'Usuário registrado com sucesso', user: { username, password } });
  };
  