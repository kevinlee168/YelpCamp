const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');
const AppError = require('../AppError');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({storage});

//使用 router.route('path') 将有同样前缀的路径组织到一起
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.addCampground))

//这个方法必须放在根据id查询方法的前面
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;

