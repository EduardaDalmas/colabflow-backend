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
router.get('/users/accountProfile/:id', userController.getUserById);
router.post('/users/account/edit', userController.editUser);
router.post('/user/photo', userController.addPhoto);

// Rotas de chat
router.get('/chats', chatController.getAllChats);
router.get('/chats-archive/:id_group', chatController.getArchivedChats);
router.get('/chats/users/:id_chat', chatController.getUsersChat);
router.get('/chats/:id_group/:id_user', chatController.getChatByGroupId);
router.get('/chats-dump/:id_chat', chatController.dumpChat);
router.post('/chatsuser/:id_chat/:id_user', chatController.deleteUserChat);
router.post('/chats', chatController.createChat);
router.post('/chats/edit', chatController.editChat);
router.post('/chats/users', chatController.createUserChat);
router.post('/chats/archive/:id_chat', chatController.archiveChat);


// Rotas de autenticação
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/verify', authController.verifyOTP);

// Rotas de perfil
router.post('/profiles', profileController.createProfile);
router.get('/profiles/:id_user', profileController.getProfileByUserId);
router.post('/profiles/edit', profileController.editProfile);
router.post('/profiles/delete', profileController.deleteProfile);

// Rotas de grupos
router.post('/groups', groupController.createGroup);
router.get('/groups/by-chat/:id_user', groupController.getGroupByChatUser);
router.get('/groups/:id_user/:id_context', groupController.getGroupByUserId);
router.post('/groups/edit', groupController.editGroup);
router.post('/groups/delete', groupController.deleteGroup);

// Rotas de grupo
router.get('/group/owner/:id_group', groupController.getGroupOwner);

// Rotas para links
router.post('/links', linkController.createLink);
router.get('/links/:id_chat', linkController.getLinksByChatId);
router.post('/links/:id', linkController.deleteLink);


module.exports = router;
