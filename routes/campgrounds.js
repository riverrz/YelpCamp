// Contains all the campgrounds routes
var express = require("express");
var router  = express.Router();
var Camps   = require("../models/campgrounds");
var middleware = require("../middleware/index.js"); // Contains all the middleware needed


// INDEX - shows all the campgrounds

router.get("/", function(req,res) {
    // req.user , passport has created req.user this which contains the info abput the current user , if user is nnot logged in then its undefined else it contains the name.
    Camps.find({}, function(err, camps) {
        if (err) {
            console.log("An Error occured while printing");
        }
        else {
            res.render("campgrounds/campgrounds", {camps:camps});  // campgrounds.ejs inside campgrounds folder
        }
    });
    
});

// CREATE - creates a new campground
router.post("/", middleware.isLoggedIn ,function(req,res) {
    // Adding new Camp Grounds
    var new_name = req.body.name;
    var new_image = req.body.image;
    var new_description = req.body.description;
    var author= {
        id: req.user._id,
        username: req.user.username
    };
    var price = req.body.price;
    var newCampGround = {name:new_name , price:price ,image: new_image , description: new_description, author:author};
    // Creating new Campgrounds
    Camps.create(newCampGround, function(err, camp) {
       if (err) {
           console.log("An Error Occured while adding a new campground!");
       } 
       else {
           // Redirecting to the campgrounds page
            res.redirect("/campgrounds"); 
       }
    });
    
});

// NEW - shows the form to create a new campground

router.get("/new", middleware.isLoggedIn ,function(req,res) {
   res.render("campgrounds/new"); 
});

// SHOW - show details of a particular campgrounds
router.get("/:id", function(req,res) {
   // Show a campground based on the id provided
   Camps.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
       if (err) {
           console.log("No camp by this id!");
       }
       else {
            res.render("campgrounds/show", {foundCamp: foundCamp});  
            
       }
   });
   
});

// EDIT CAMPGROUND ROUTE

router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req,res){
    
    Camps.findById(req.params.id, function(err,campground){
       if (err) {
           req.flash("error", "Sorry, cannot find the campground.");
           res.redirect("back");
       } else {
           res.render("campgrounds/edit", {campground:campground});
       }
    });
    
    
});
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res) {
   Camps.findByIdAndUpdate(req.params.id, req.body.update, function(err,updateCampground) {
       if (err) {
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/"+req.params.id);
       }
   }) ;
});

// DELETE ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res) {
   Camps.findByIdAndRemove(req.params.id, function(err) {
       if (err) {
           res.redirect("/campgrounds");
       } else {
            res.redirect("/campgrounds");     
       }
   }); 
});





module.exports = router;