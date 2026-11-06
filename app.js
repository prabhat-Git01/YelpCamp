import express from "express";
import morgan from "morgan";
import AppError from "./AppError.js";
const app = express();

app.use(morgan('tiny'));


app.listen(3000, () => {
    console.log("App listening on port 3000");
})

// Defining our own middleware 
// app.use((req, res, next) => {
//     console.log("This is my first middleware !!");
//     next();
// })

// app.use((req, res, next) => {
//     console.log("This is my second middleware !!");
//     next();
// })


app.use((req, res, next) => {
    req.requestTime = Date.now();
    console.log(req.method, req.path);
    next();
})


const verifyPassword = ( req, res, next) => {
    const { pass } = req.query;
    if(pass === 'charming123') {
        next();
    } 
    // console.log("Inavlid Password !!!");
    // res.status(401).send("Invalid Password !!");
    // res.send(new AppError("Invalid Password !!", 401));
    throw new AppError("Invalid Password !!", 401);
    
}

app.get('/', verifyPassword, (req, res) => {
    console.log(`Request Date : ${req.requestTime}`);
    res.send("Welcome to Homepage");
})



app.get('/dog', (req, res) => {
    res.send("Woof WOOof !!!");
})



app.get('/error', (req, res) => {
    chicken.fly();
})

app.use((err, req, res, next) => {
    console.log("*************Error************");
    next(err);
})

app.use((req, res) => {
    res.status(404).send("NOT FOUND !!");
})

