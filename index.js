import express from "express";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import CampGround from "./models/campGround.models.js";
const app = express();

dotenv.config({
    path: './.env'
})
const port = process.env.PORT;

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

app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/makecampground',async (req, res) => {
    const camp = new CampGround({title: 'My backyard', description: "Cheap Camping !"});
    await camp.save();
    res.send(camp);
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})