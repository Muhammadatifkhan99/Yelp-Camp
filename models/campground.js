const mongoose = require("mongoose");
const review = require("./review");

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})
//we use virtuals because we do not want to store this information on the model because we are deriving this information...


ImageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload","/upload/w_200")
});

const CampgroundSchema = new Schema({
    title: String,
    images:[ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]   
})

CampgroundSchema.post("findOneAndDelete", async function (doc){
    if(doc){
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model("Campground", CampgroundSchema);