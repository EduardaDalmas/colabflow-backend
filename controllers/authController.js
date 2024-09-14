// controllers/AuthController.js
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const secret = 'sua_chave_secreta';



// Função para login
exports.login = (req, res) => {
    const { email } = req.body;
    console.log(req.body);
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error('Erro ao buscar usuário:', err);
        return res.status(500).send('Erro ao buscar usuário');
      }
      if (results.length === 0) {
        return res.status(404).send('Usuário não encontrado');
      }
      // verifica se o usuario esta ativo
      if (results[0].deleted_at !== null) {
        return res.status(401).send('Usuário desativado');
      }
      const user = results[0];

      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        // Outros dados que você queira incluir
      };
      const token = jwt.sign(payload, secret, { expiresIn: 86400 }); // 24 horas

      res.status(200).send({ auth: true, token: token, user: { id: user.id, name: user.name, email: user.email } });

    });


  };
  
  // Função para registro
  exports.register = (req, res) => {
    const { name, email } = req.body;
    console.log(req.body);

    db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
      if (err) {
        console.error('Erro ao registrar usuário:', err);
        return res.status(500).send('Erro ao registrar usuário');
      }
      res.status(200).send('Usuário registrado com sucesso');
    });

  };
  