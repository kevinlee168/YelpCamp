const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../AppError');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Add Campground Successfully.');
    res.redirect(`/campgrounds/${newCampground._id}`);

}))

//这个方法必须放在根据id查询方法的前面
router.get('/new', isLoggedIn, async (req, res) => {
    res.render('campgrounds/new');
})

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'The Campground Does Not Exist!');
        return res.redirect('/campgrounds');
    } 
    res.render('campgrounds/edit', { campground });
}))

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews').populate('author');
    console.log(campground);
    if (!campground) {
        req.flash('error', 'The Campground Does Not Exist!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))

/**
 * update the campground (find by id)
 */

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'The Campground Does Not Exist!');
        return res.redirect('/campgrounds');
    }

    const camp = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });

    //res.render('campgrounds/show', { campground });
    req.flash('success', 'Update Campground Successfully.');
    res.redirect(`/campgrounds/${id}`);
}))

/**
 * delete the campground (by id)
 */

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);  //This function triggers the following middleware: findOneAndDelete()

    req.flash('success', 'Delete Campground Successfully.');
    res.redirect('/campgrounds/');
}))

module.exports = router;