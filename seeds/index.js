import mongoose from "mongoose";
import CampGround from "../models/campGround.models.js";
import dotenv from "dotenv";
import cities from "./cities.js";
import { descriptors, places } from "./seedHelpers.js";

dotenv.config({
    path: './.env'
})

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
        console.log(`MongoDB connected Successfully !! , Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection Failed !!", error);
        process.exit(1);
    }
}
connectDB();


const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
    await CampGround.deleteMany({});
    for(let i=0; i<50; i++) {
        const randomIdx = Math.floor(Math.random() * 1000);
        const camp = new CampGround({
            location: `${cities[randomIdx].city}, ${cities[randomIdx].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})