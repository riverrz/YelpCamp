var Camps = require("../models/campgrounds");
var Comment = require("../models/comment");

// ALL THE MIDDLEWARE GOES HERE
var middlewareObj={};
middlewareObj.checkCampgroundOwnership = function (req,res,next) {
    if (req.isAuthenticated()) {
        Camps.findById(req.params.id, function(err,campground){
            if (err) {
                req.flash("error", "Campground not found.")
                res.redirect("back");      // Takes the user to previous page, its inbuilt.
            } else {
                // Check if the user own's campground
                // we cannot do campground.author.id === req.user._id as campground.author.id is a mongoose object where as req.user.id is a string
                // .equals method given by mongoose
                if (campground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that.");
                    res.redirect("back");
                }
                
            } 
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");  
    }
};

middlewareObj.checkCommentOwnership = function (req,res,next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, comment) {
           if (err) {
               res.redirect("back");
           } else {
               if (comment.author.id.equals(req.user._id)) {
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that.");
                   res.redirect("back");
               }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    } 
};
middlewareObj.isLoggedIn = function (req,res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!"); // This should be before redirect and it will be used as an object in the /login route, check index.js of routes.
    res.redirect("/login");
};


module.exports = middlewareObj;