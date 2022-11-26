const express = require('express');
const router = express.Router({ mergeParams: true }); /****** mergeParams: true  -  Preserve the req.params values from the parent router. */
const Review = require('../models/review');
const Campground = require('../models/campground');
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../AppError');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

//***************** add a new reviw **************/
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.addReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;