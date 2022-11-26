const express = require('express');
const router = express.Router();
const User = require('../models/user');
const users = require('../controllers/users')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../AppError');
const password = require('passport');
const user = require('../models/user');


router.get('/register', users.renderRegister)

router.post('/register', catchAsync(users.register));

router.get('/login', users.renderLogin)
/** password 作为 middleware 自动验证登陆 */
router.post('/login', password.authenticate('local', { failureRedirect: 'login', failureFlash: true }), catchAsync(users.login))

router.get('/logout', catchAsync(users.logout))


module.exports = router;