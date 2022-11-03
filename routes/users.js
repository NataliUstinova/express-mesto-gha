const router = require('express').Router();
const { getUserById, getAllUsers, createUser } = require('../controllers/users');

router.get('/', getAllUsers);

router.get('/:userId', getUserById);

router.post('/', createUser);

module.exports = router;
