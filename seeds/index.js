const mongoose = require("mongoose");
//destructing the seedhelper file

const { descriptors,places } = require("./seedHelpers");
//requiring our own Campground model from the files
const Campground = require("../models/campground");
const cities = require("./cities");

//connection to the database
mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

//picking a random element from any array....
const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    // const c = new Campground({title: "Purple Field"});
    // await c.save();
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://images.unsplash.com/photo-1731569348001-e49c36947289?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor, blanditiis at dolore eligendi accusamus autem quam perspiciatis aut minus, error consequatur cum quidem quas fugiat nostrum recusandae fuga? Eum, dolores.",
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})