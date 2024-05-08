require('dotenv').config();
require("./db/db");
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 8000;
const path = require('path');
const hbs = require('hbs');
const app = express();
const router = require('./routers/routes');
const mongoose = require('mongoose'); 
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
    secret:process.env.SECRET_KEY,
    resave: false,
    saveUninitialized:false,
    store: new MongoStore({
        mongoUrl: process.env.MongoDB_ADD,
        mongooseConnection: mongoose.connection}),
    cookie:{maxAge: 60*60*1000}
}));
app.use(flash());

const staticPath = path.join(__dirname, "../public");
const templatesPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")));

app.use(express.static(staticPath));
app.set("view engine","hbs");
app.set("views", templatesPath);
hbs.registerPartials(partialsPath);

app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});

app.use(router);

app.listen(port,()=>{
    console.log(`Connection listening to the port ${port}`);
});
