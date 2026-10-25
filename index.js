import express from "express";
import dotenv from "dotenv";
import path from "path";
const app = express();

dotenv.config({
    path: './.env'
})
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
})