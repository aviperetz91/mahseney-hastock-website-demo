var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    methodOverride = require("method-override");
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user");

    require('dotenv').config() 

// requiring routes
var authRoutes = require("./routes/auth"),
    cartRoutes = require("./routes/cart"); 
    departmentRoutes = require("./routes/department"),

// APP CONFIG
mongoose.connect("mongodb://localhost:27017/stock_app", { useNewUrlParser: true }); 
mongoose.set('useFindAndModify', false);    // prevent warnning
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "BlahBlah BlahBlah Blah BlahBlah.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// so i can use those variablers in all templates
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// tell express to use the routes that we required
app.use(authRoutes);
app.use(cartRoutes);
app.use(departmentRoutes);

app.listen(1000, function(){
    console.log("The Stock Server Has Started!");
});