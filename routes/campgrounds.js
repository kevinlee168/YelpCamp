const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../AppError');
const { campgroundSchema } = require('../schema.js')
const { isLoggedIn } = require('../middleware');

//custom middleware to validate the campground data
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user;
    await newCampground.save();
    req.flash('success', 'Add Campground Successfully.');
    res.redirect(`/campgrounds/${newCampground._id}`);

}))

//这个方法必须放在根据id查询方法的前面
router.get('/new', isLoggedIn, async (req, res) => {
    res.render('campgrounds/new');
})

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'The Campground Does Not Exist!');
        return res.redirect('/campgrounds');
    } else if (!campground.author.equals(req.user._id)) {
        //如果参数（会话）的用户id 不等于 该campground的 author，即使不能进行编辑
        req.flash('error', 'You do not have permission to to that!');
        return res.redirect(`/campgrounds/${id}`);
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

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
    //res.render('campgrounds/show', { campground });
    req.flash('success', 'Update Campground Successfully.');
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);  //This function triggers the following middleware: findOneAndDelete()

    req.flash('success', 'Delete Campground Successfully.');
    res.redirect('/campgrounds/');
}))

module.exports = router;