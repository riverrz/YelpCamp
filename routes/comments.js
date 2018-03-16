// Contains all the comment routes
var express = require("express");
var router  = express.Router({mergeParams:true}); // This will merge the params of common prefix written in app.use in app.js , by this we can use findById in the post route even though id is not defined in this local route. 
var Camps   = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");  // COntains all the middlewares needed



// NEW ROUTE FOR COMMENTS
router.get("/new", middleware.isLoggedIn ,function(req,res) {
    // Finding the campground by id and passing to this template
    Camps.findById(req.params.id, function(err, foundCamp) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCamp});
        }
    });
   
});
// Comments post route to handle creating new comment.
router.post("/", middleware.isLoggedIn ,function(req,res) {
   // Finding campground through id 
   // Making a new Comment
   // Connecting them together
   Camps.findById(req.params.id, function(err,campground) {
      if (err) {
          console.log(err);
          res.redirect("/campgrounds");
      } else {
          Comment.create(req.body.comment , function(err,comment) {
              if (err) {
                  console.log(err);
                  
              } else {
                  // Adding Username and id to the comment
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  // saving the comment
                  comment.save();
                  campground.comments.push(comment);
                  campground.save();
                  req.flash("success", "Your comment has been successfully created!");
                  res.redirect("/campgrounds/"+campground._id);
              }
          });
      }
   });
});
// EDIT ROUTES
router.get("/:comment_id/edit", middleware.checkCommentOwnership , function(req,res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {comment: foundComment, campground_id: req.params.id});            
        }
    });
  
});
// handling editing of the comments
router.put("/:comment_id", middleware.checkCommentOwnership , function(req,res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
      if (err) {
          res.redirect("back");
      } else {
          req.flash("success", "Your comment has been successfully updated!");
          res.redirect("/campgrounds/"+req.params.id);
      }
   });
});

// Destroying a comment
router.delete("/:comment_id", middleware.checkCommentOwnership ,function(req,res) {
   Comment.findByIdAndRemove(req.params.comment_id , function(err) {
       if(err) {
           res.redirect("back");
       }else {
           req.flash("success","Your comment has been successfully removed!");
           res.redirect("/campgrounds/"+req.params.id);
       }
   }) 
});





module.exports = router;