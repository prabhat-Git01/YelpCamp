import express from "express";
import morgan from "morgan";
const app = express();

app.use(morgan('tiny'));

// Defining our own middleware 
app.use((req, res, next) => {
    console.log("This is my first middleware !!");
    next();
})

app.use((req, res, next) => {
    console.log("This is my second middleware !!");
    next();
})

app.use((req, res, next) => {
    req.requestTime = Date.now();
    console.log(req.method, req.path);
    next();
})

const verifyPassword = (req, res, next) => {
    const { pass } = req.query;
    if(pass === 'charming123') {
        next();
    } 
    console.log("Inavlid Password !!!");
}

app.listen(3000, () => {
    console.log("App listening on port 3000");
})

app.get('/', verifyPassword, (req, res) => {
    console.log(`Request Date : ${req.requestTime}`);
    res.send("Welcome to Homepage");
})

app.get('/dog', (req, res) => {
    res.send("Woof WOOof !!!");
})