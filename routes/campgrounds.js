const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../AppError');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

router.get('/', catchAsync(campgrounds.index))

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.addCampground))

//这个方法必须放在根据id查询方法的前面
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.get('/:id', catchAsync(campgrounds.showCampground))

/**
 * update the campground (find by id)
 */

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

/**
 * delete the campground (by id)
 */

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;

