const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authorization, authorizeLibrarian } = require('../middlewares/auth');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile', authorization, userController.getUserProfile);
router.put('/update/self', authorization, userController.updateSelf);
router.delete('/delete/self', authorization, userController.deleteSelf);

router.get('/activeMembers', authorizeLibrarian, userController.getAllActiveMembers);
router.get('/deletedMembers', authorizeLibrarian, userController.getAllDeletedMembers);
router.get('/member/:userId', authorizeLibrarian, userController.getMemberById);
router.put('/update/:userId', authorizeLibrarian, userController.updateMember);
router.delete('/delete/:userId', authorizeLibrarian, userController.deleteMember);

module.exports= router;