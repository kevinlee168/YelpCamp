const Campground = require('./models/campground');
const { campgroundSchema, reviewSchema } = require('./schema.js');
const AppError = require('./AppError');

// to verify if the user loggedin
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/user/login');
    }
    next();
}

//custom middleware to validate the campground data
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
}

//to verify if the user have the permission to do that
module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);

    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to to that!');
        return res.redirect(`/campgrounds/${id}`);
    }

    next();
}

//custom middleware to validate the reivew data
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
}

