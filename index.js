import express from "express";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import CampGround from "./models/campGround.models.js";
import catchAsync from "./utils/catchAsync.js";
import ExpressError from "./utils/ExpressError.js";
import Joi from "joi";
import { campgroundSchema } from "./schemas.js";
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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
    // const campgroundSchema = Joi.object({
    //     campground: Joi.object({
    //         title: Joi.string().required(),
    //         image: Joi.string().required(),
    //         price: Joi.number().required().min(0),
    //         description: Joi.string().required(),
    //         location: Joi.string().required()
    //     }).required()
    // })
    // const result = campgroundSchema.validate(req.body);
    // console.log(result);
    
    const { error } = campgroundSchema.validate(req.body, {abortEarly: false});
    // console.log(error.details);

    if(error) {
        // return next(error);
        const msg = error.details.map(el => el.message).join(',');

        throw new ExpressError(msg, 400);
    }


    next();
}

app.get('/', (req, res) => {
    // res.render('home');
    res.redirect('/campgrounds');
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

app.post('/campgrounds', validateCampground, async (req, res, next) => {
    // if(!req.body.campground) {
    //     throw new ExpressError("Inavlid Campground Data !!", 400);
    // }
    // const { title, location, image, price, description } = req.body.campground;
    // const campground = new CampGround({ title: title, location: location, image: image, price: price, description: description });

    const campground = new CampGround(req.body.campground);
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

app.put('/campgrounds/:id', validateCampground, async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndUpdate(id, req.body.campground);

    res.redirect(`/campgrounds/${id}`);
})

app.delete('/campgrounds/:id', async (req, res) => {
    await CampGround.findByIdAndDelete(req.params.id);

    res.redirect('/campgrounds');
})

// Error Handling Middleware

// app.all('*', (req, res, next) => {
//     res.send("404!!!!");
// })

app.use((req, res, next) => {
    // res.status(404).send("Page Not Found !!");
    next(new ExpressError("Page Not Found !!", 404));
})

app.use((err, req, res, next) => {
    // res.send("Something went wrong !!");
    const {message = " Something went wrong !!", statusCode = 500} = err;
    res.status(statusCode).render('error', { err });
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})