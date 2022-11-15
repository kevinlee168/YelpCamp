const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../AppError');
const password = require('passport');


router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res) => {
    const { username, email, password, repassword } = req.body;
    if (password != repassword) {
        req.flash('error', 'Password dose NOT matche!');
        res.redirect('register');
    } else {
        try {
            const user = new User({ email, username });
            const registeredUser = await User.register(user, password);
            req.flash('success', 'Welcome to x-YelpCamp!');
            req.login(registeredUser, function (err) {
                if (err) { return next(err) }
                return res.redirect('/campgrounds');  //注意：此处必须是 return .... 才有效
            });
        } catch (e) {
            req.flash('error', e.message);
            res.redirect('register');
        }
    }

}));


router.get('/login', (req, res) => {
    res.render('users/login');
})

/** password 作为 middleware 自动验证登陆 */
router.post('/login', password.authenticate('local', { failureRedirect: 'login', failureFlash: true }),
    catchAsync(async (req, res) => {
        const { username } = req.body;
        req.flash('success', `Hi, ${username}! Welcome back to x-Yelpcamp`);
        // const user = await User.findOne({ username })
        // req.session.uid = user._id;
        // req.session.username = user.username;
        // req.session.logined = true;
        const returnTo = req.session.returnTo;
        delete req.session.returnTo;
        const rediretUrl = returnTo || '/campgrounds';
        res.redirect(rediretUrl);
    }))

router.get('/logout', catchAsync(async (req, res) => {
    // req.session.logined = false;
    // req.session.uid = null;
    // req.session.username = null;
    req.logout();
    req.flash('success', 'Logout succeed!');
    res.redirect('/campgrounds');
}))



module.exports = router;