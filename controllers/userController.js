// controllers/UserController.js
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const secret = 'sua_chave_secreta';




exports.getUserByEmail = (req, res) => {
    const userEmail = req.params.email;
    const userQuery = `SELECT * FROM users WHERE email = '${userEmail}'`;

    db.query(userQuery, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            console.log('Erro ao buscar usuário:', err);
            return res.status(500).send('Erro ao buscar usuário');
        }
        if (results.length === 0) {
            console.log('Usuário não encontrado');
            return res.status(404).send('Usuário não encontrado');
        }
        const user = results[0];
        res.json(user);
    });
};

exports.getUserById = (req, res) => {
    const id = req.params.id;
    console.log(id);
    const userQuery = `SELECT * FROM users WHERE id = '${id}'`;

    db.query(userQuery, (err, results) => {
        if (err) {
            console.log('Erro ao buscar usuário:', err);
            return res.status(500).send('Erro ao buscar usuário');
        }
        if (results.length === 0) {
            console.log('Usuário não encontrado');
            return res.status(404).send('Usuário não encontrado');
        }
        const user = results[0];
        res.json(user);
    });
};

exports.editUser = (req, res) => {
    const { name, email, link_profile, status, id } = req.body;

    const userQuery = `UPDATE users SET name = ?, email = ?, link_profile = ?, status = ? WHERE id = ?`;

    db.query(userQuery, [name, email, link_profile, status, id], (err, results) => {
        if (err) {
            console.error('Erro ao editar usuário:', err);
            return res.status(500).json({ message: 'Erro ao editar usuário', error: err });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: 'Usuário editado com sucesso' });
    });
};



  
exports.createUser = (req, res) => {
    const newUser = req.body;
    // Aqui você salvaria o novo usuário no banco de dados
    res.status(201).json({ message: 'Usuário criado com sucesso', user: newUser });
};
