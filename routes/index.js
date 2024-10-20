const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');

// Rotas de usuários
router.post('/users', userController.createUser);
router.get('/users/account/:email', userController.getUserByEmail);
router.post('/users/account/edit', userController.editUser);

// Rotas de chat
router.get('/chats', chatController.getAllChats);
router.get('/chats/:id', chatController.getChatById);
router.post('/chats', chatController.createChat);

// Rotas de autenticação
router.post('/login', authController.login);
router.post('/register', authController.register);

// Rotas de perfil
router.post('/profiles', profileController.createProfile);
router.get('/profiles/:id_user', profileController.getProfileByUserId);

module.exports = router;
