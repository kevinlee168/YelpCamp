const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = async (req, res) => {
    res.render('campgrounds/new');
}

module.exports.addCampground = async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    newCampground.author = req.user._id;
    console.log(newCampground);
    await newCampground.save();
    req.flash('success', 'Add Campground Successfully.');
    res.redirect(`/campgrounds/${newCampground._id}`);

}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'The Campground Does Not Exist!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews', populate: {
            path: 'author'
        }
    }).populate('author');

    console.log(campground);

    if (!campground) {
        req.flash('error', 'The Campground Does Not Exist!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}




module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'The Campground Does Not Exist!');
        return res.redirect('/campgrounds');
    }

    const camp = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });

    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    camp.images.push(...imgs);
    await camp.save();
    
    //res.render('campgrounds/show', { campground });
    req.flash('success', 'Successfully update the campground.');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);  //This function triggers the following middleware: findOneAndDelete()

    req.flash('success', 'Delete Campground Successfully.');
    res.redirect('/campgrounds/');
}