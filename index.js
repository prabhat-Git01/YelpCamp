import express from "express";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import methodOverride from "method-override";
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

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
})

// app.get('/makecampground',async (req, res) => {
//     const camp = new CampGround({title: 'My backyard', description: "Cheap Camping !"});
//     await camp.save();
//     res.send(camp);
// })

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await CampGround.find({});

    res.render('campgrounds/index', { campgrounds });
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const { title , location } = req.body.campground;
    const campground = new CampGround({ title: title, location: location });
    await campground.save();

    res.redirect(`/campgrounds/${campground._id}`);
})

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);

    res.render('campgrounds/show', { campground });
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndUpdate(id, req.body.campground);

    res.redirect(`/campgrounds/${id}`);
})

app.delete('/campgrounds/:id', async (req, res) => {
    await CampGround.findByIdAndDelete(req.params.id);

    res.redirect('/campgrounds');
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})