const express = require('express');
const r = express.Router();

const authController = require('../controllers/authController');
console.log('AUTH CONTROLLER:', authController);

const { signup, login, getMe } = authController;

const { protect } = require('../middleware/auth');

r.post('/signup', signup);
r.post('/login', login);
r.get('/me', protect, getMe);

module.exports = r;