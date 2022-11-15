const express = require('express');
const router = express.Router({ mergeParams: true }); /****** mergeParams: true  -  Preserve the req.params values from the parent router. */
const Review = require('../models/review');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../AppError');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

//***************** add a new reviw **************/
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(id);
    const campground = await Campground.findById(id);

    const review = new Review(req.body.review);
    review.author = req.user._id;

    campground.reviews.push(review);
    review.save();
    campground.save();

    req.flash('success', 'Add Review Successfully.');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash('success', 'Delete Review Successfully.');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;