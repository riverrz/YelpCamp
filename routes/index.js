// This contains all the routes not related to cmapgrounds or comments , like auth routes etc
var express = require("express");
var router  = express.Router();
var User    = require("../models/user");
var passport = require("passport");

// Root route
router.get("/", function(req,res) {
    res.render("landing");
});


// Register Form
router.get("/register", function(req,res) {
   res.render("register"); 
});
// Handles the register process
router.post("/register", function(req,res) {
   User.register(new User({ username: req.body.username}), req.body.password, function(err, user){
           if(err){
                req.flash("error", err.message);
                return res.redirect("/register");
            }
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to YelpCamp "+ user.username);
           res.redirect("/campgrounds");
       });
   }) ;
});

// LOGIN ROUTES
// LOGIN FORM
router.get("/login", function(req,res) {
   res.render("login");    
});
// handling login logic
router.post("/login",passport.authenticate("local", {
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res) {
});

//LOGOUT ROUTE
router.get("/logout", function(req,res) {
    req.logout();
    req.flash("success", "Successfully Logged Out!");
    res.redirect("/campgrounds");
});


module.exports = router;