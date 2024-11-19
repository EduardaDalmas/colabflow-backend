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



// inserir foto de perfil no campo photo
exports.addPhoto = (req, res) => {
    const { id_user } = req.params;  // Pega o id_user da URL
    const photo = req.file;  // O arquivo de foto estará em req.file quando usar o multer
    // Verificação básica para garantir que uma foto foi enviada
    if (!photo || photo.length === 0) {
        return res.status(400).json({ message: 'Nenhuma foto foi enviada.' });
    }
    

    const userQuery = `UPDATE users SET photo = ? WHERE id = ?`;

    db.query(userQuery, [photo.buffer, id_user], (err, results) => {
        if (err) {
            console.error('Erro ao adicionar foto:', err);

            return res.status(500).json({ message: 'Erro ao adicionar foto', error: err });
            
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: 'Foto adicionada com sucesso' });
        console.log('ok');
    });
};