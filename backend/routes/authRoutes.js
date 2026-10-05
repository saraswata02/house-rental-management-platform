const express = require('express');
const router = express.Router();
const { checkEmail, register, login, socialLogin } = require('../controllers/authController');

router.get('/check-email', checkEmail);
router.post('/register', register);
router.post('/login', login);
router.post('/social-login', socialLogin);

module.exports = router;
