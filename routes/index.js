// This contains all the routes not related to cmapgrounds or comments , like auth routes etc
var express = require("express");
var router  = express.Router();
var User    = require("../models/user");
var Camps   = require("../models/campgrounds");
var passport = require("passport");
var middleware = require("../middleware/index.js");

// Root route
router.get("/", function(req,res) {
    res.render("landing");
});


// Register Form
router.get("/register", function(req,res) {
   res.render("register", {page: "register"}); 
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
   res.render("login", {page: "login"});    
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

// Handling Likes and dislikes 
router.post("/campgrounds/:id/count/:mode" ,function(req,res) {
    Camps.findById(req.params.id, function(err,foundCamp) {
        if (err) {
            console.log("Cannot update the counter");
            res.redirect("back");
        } else {
            if (req.params.mode==="liked") {
                foundCamp.likes+=1;    
            } else {
                foundCamp.dislikes+=1;
            }
            foundCamp.save();
            res.end();
        }
    });
});


module.exports = router;