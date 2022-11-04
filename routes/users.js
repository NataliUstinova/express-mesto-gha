const router = require('express').Router();
const { getUserById, getAllUsers, createUser, updateUserInfo, updateAvatar} = require('../controllers/users');

router.get('/', getAllUsers);

router.get('/:userId', getUserById);

router.post('/', createUser);

router.patch('/me', updateUserInfo);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
