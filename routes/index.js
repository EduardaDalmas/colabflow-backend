const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');

// Rotas de usuários
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);

// Rotas de chat
router.get('/chats', chatController.getAllChats);
router.get('/chats/:id', chatController.getChatById);
router.post('/chats', chatController.createChat);

// Rotas de autenticação
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;