if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');  //使得服务器端支持来自前端PUT等方法
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const AppError = require('./AppError');
const campgroundRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews');
const userRouter = require('./routes/users');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));  //Serviing static assets
app.use(express.urlencoded({ extended: true }));  //支持获取来自前端表格中提交的数据
app.use(methodOverride('_method')); //使得服务器端支持来自前端PUT等方法
app.use(morgan('dev'));

/*************** express-session config  *****************/
const sessionConfig = {
    secret: 'itshoudbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

/****** password configure */
/** Note that: 这需要放在 express-session config 之后 */
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//custom middleware
// app.use('/campgrounds/new', (req, res, next) => {
//     console.log('New a Campgrounds');
//     next();
// })

/********** use mongoose to connecte to MongoDB *************/
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', () => { console.log('DB connected') });

/*************integrate flash message  ***********/
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    next();
})

app.use((req, res, next) => {
    // use currentPage to keep the name of the current page. 
    res.locals.currentPage = req.path.split('/')[1] || 'home';
    next();
  });

/**************set router for campgrounds ***************/
app.use('/campgrounds', campgroundRouter);
/**************set router for reviews ***************/
app.use('/campgrounds/:id/reviews', reviewRouter)
app.use('/user', userRouter)

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'kevinss@gmail.com', username: 'k' });
    const newUser = await User.register(user, 'k');
    res.send(newUser);
})

//404 Not Found
app.all('*', (req, res, next) => {
    next(new AppError('404 Error - Page Not Found...', 404));
})

// Error handler
app.use((err, req, res, next) => {
    const { status = 500, message = 'something went wrong' } = err;
    res.status(status).render('error', { status, message });
})


app.listen(3001, () => {
    console.log('Serving on port 3001');
})