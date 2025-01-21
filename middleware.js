//requiring the expresserror class
const ExpressError = require("./utils/ExpressError");
//the campground schema
const { campgroundSchema } = require("./schema.js");
//the file for review schema from the schema 
const { reviewSchema } = require("./schema.js")

const Review = require("./models/review.js")
const Campground = require("./models/campground.js")



module.exports.isLoggedIn = (req,res,next) => {
    // console.log("REQ.USER...",req.user);
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        // console.log(req.session.returnTo = req.originalUrl);
        req.flash("error","you must sign in");
        return res.redirect("/login");
    }
    next();
}

module.exports.validateCampground = (req,res,next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg,400);
    } else {
        next();
    }
}



module.exports.isReviewAuthor = async (req,res,next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error","You do not have permissions to that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


module.exports.isAuthor = async (req,res,next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash("error","You do not have permissions to that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg,400);
    } else {
        next();
    }
}
