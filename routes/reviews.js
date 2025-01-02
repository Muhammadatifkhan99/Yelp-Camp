const express = require("express");
//as the /:id is in the separate file form the router file so the params needs to be merged otherwise it won't work as expect
//for the campground routes......................
//the campground routes have the /:id defined in the campground routes file that is why it does not needed the merged params

const router = express.Router({mergeParams: true});

//requiring the CatchAsync Wrapper class/function
const CatchAsync = require("../utils/CatchAsync");
//requiring the expresserror class
const ExpressError = require("../utils/ExpressError");

const { reviewSchema } = require("../schema.js");

const Review = require("../models/review.js");
const Campground = require("../models/campground");



const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg,400);
    } else {
        next();
    }
}


router.post("/",validateReview,CatchAsync (async(req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Your review was added");
    res.redirect(`/campgrounds/${campground._id}`)

}))

router.delete("/:reviewId", CatchAsync(async (req,res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Your review was deleted");
    res.redirect(`/campgrounds/${id}`);
}))


module.exports = router;