const Campground = require("../models/campground");

module.exports.index =  async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}

module.exports.renderNewForm =  (req,res) => {
    // if(!req.isAuthenticated()){
    //     req.flash("error","you must sign in");
    //     return res.redirect("/login");
    // }
    res.render("campgrounds/new");
}

module.exports.createCampground = async (req,res,next) => {
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data",400);
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash("success", "Successfully made a new campground");
    res.redirect(`campgrounds/${campground._id}`);
}

// module.exports.createCampground = async (req,res) => {
//     // if(!req.body.campground) throw new ExpressError("Invalid Campground Data",400);
//     const campground = new Campground(req.body.campground);
//     campground.author = req.user._id;
//     await campground.save();
//     req.flash("success", "Successfully made a new campground");
//     res.redirect(`campgrounds/${campground._id}`);
// }


module.exports.showCampground =  async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate
    ({path:"reviews",
        populate: {
            path: "author"
        }
    })
    .populate("author");
    // console.log(campground);
    if(!campground){
        req.flash("error","Cannot find that campground");
        return res.redirect("/campgrounds");
    }
    // console.log(campground);
    res.render("campgrounds/show", { campground });
}

module.exports.renderEditForm = async (req,res) => {
    const { id } = req.params;
    // console.log(req.params);
    const editcampground = await Campground.findById(id);
    if(!editcampground){
        req.flash("error","Cannot find that campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { editcampground });
}

module.exports.updateCampground = async (req,res) => {
    const { id } = req.params;
    // console.log(req.params);
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground });
    //we need not to push an array of images to the array of images we already have, spread it before adding it into array
    const img = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.images.push(...img);
    await campground.save();
    req.flash("success", "Successfully updated campground");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success","The campground was deleted");
    res.redirect("/campgrounds");
}