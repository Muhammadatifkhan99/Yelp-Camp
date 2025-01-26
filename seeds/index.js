const mongoose = require("mongoose");
//destructing the seedhelper file

const { descriptors,places } = require("./seedHelpers");
//requiring our own Campground model from the files
const Campground = require("../models/campground");
const cities = require("./cities");


//connecting to the cloud database
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://atif:atif123@cluster0.arwq7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);



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
            author:"67890b8a511dbe677d6e23f4",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor, blanditiis at dolore eligendi accusamus autem quam perspiciatis aut minus, error consequatur cum quidem quas fugiat nostrum recusandae fuga? Eum, dolores.",
            price,
            images:  [
                {
                  url: 'https://res.cloudinary.com/dta6ham5p/image/upload/v1737908918/Yelp-Camp/dqjdrqdf9agsvjijqaij.jpg',
                  filename: 'Yelp-Camp/dqjdrqdf9agsvjijqaij',
                },
                {
                  url: 'https://res.cloudinary.com/dta6ham5p/image/upload/v1737908921/Yelp-Camp/qbdwcrzbclqoxrnqihph.jpg',
                  filename: 'Yelp-Camp/qbdwcrzbclqoxrnqihph',
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})