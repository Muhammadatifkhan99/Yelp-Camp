const Review = require("../models/review.js");
const Campground = require("../models/campground");



module.exports.createReview = async(req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Your review was added");
    res.redirect(`/campgrounds/${campground._id}`)

}

module.exports.deleteReview = async (req,res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Your review was deleted");
    res.redirect(`/campgrounds/${id}`);
}