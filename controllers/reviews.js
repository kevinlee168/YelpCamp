const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.addReview = async (req, res, next) => {
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
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash('success', 'Delete Review Successfully.');
    res.redirect(`/campgrounds/${id}`);
}