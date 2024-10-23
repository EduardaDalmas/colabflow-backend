const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const chatController = require('../controllers/chatController');
const authController = require('../controllers/authController');
const profileController = require('../controllers/profileController');
const groupController = require('../controllers/groupController');
const linkController = require('../controllers/linkController');

// Rotas de usuários
router.post('/users', userController.createUser);
router.get('/users/account/:email', userController.getUserByEmail);
router.post('/users/account/edit', userController.editUser);

// Rotas de chat
router.get('/chats', chatController.getAllChats);
router.get('/chats/:id', chatController.getChatByGroupId);
router.post('/chats', chatController.createChat);
router.post('/chats/edit', chatController.editChat);

// Rotas de autenticação
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/verify', authController.verifyOTP);

// Rotas de perfil
router.post('/profiles', profileController.createProfile);
router.get('/profiles/:id_user', profileController.getProfileByUserId);

// Rotas de grupos
router.post('/groups', groupController.createGroup);
router.get('/groups/:id_user/:id_context', groupController.getGroupByUserId);

// Rotas para links
router.post('/links', linkController.createLink);
router.get('/links/:id_chat', linkController.getLinksByChatId);
router.post('/links/:id', linkController.deleteLink);


module.exports = router;
