const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
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

}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = async (req, res) => {
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
}

module.exports.logout = async (req, res) => {
    // req.session.logined = false;
    // req.session.uid = null;
    // req.session.username = null;
    req.logout();
    req.flash('success', 'Logout succeed!');
    res.redirect('/campgrounds');
}