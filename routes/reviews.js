const express = require('express');
const router = express.Router({ mergeParams: true }); /****** mergeParams: true  -  Preserve the req.params values from the parent router. */
const Review = require('../models/review');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../AppError');
const { reviewSchema } = require('../schema.js')


//custom middleware to validate the reivew data
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
}

//***************** add a new reviw **************/
router.post('/', validateReview, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const campground = await Campground.findById(id);

    const review = new Review(req.body.review);
    campground.reviews.push(review);
    review.save();
    campground.save();
    req.flash('success', 'Add Review Successfully.');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash('success', 'Delete Review Successfully.');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;