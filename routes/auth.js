var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ROOT ROUTE
router.get("/", function(req, res) {
    res.render("home");
});

// REGISTER
//show register form
router.get("/register", function(req, res) {
    res.render("register");
});

// handling user sign up
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    if(req.body.adminCode === "secretCode") {
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/");
        });
    });
});

// LOGIN
// show login form
router.get("/login", function(req, res){
    res.render("login");
});

// handling login logic
// middleware - some code that runs before our final callback, app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req, res) {
});

// LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});


module.exports = router;