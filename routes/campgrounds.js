// Contains all the campgrounds routes
var express = require("express");
var router  = express.Router();
var Camps   = require("../models/campgrounds");
var Users   = require("../models/user");
var middleware = require("../middleware/index.js"); // Contains all the middleware needed
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// INDEX - shows all the campgrounds

router.get("/", function(req,res) {
    // req.user , passport has created req.user this which contains the info abput the current user , if user is nnot logged in then its undefined else it contains the name.
    Camps.find({}, function(err, camps) {
        if (err) {
            console.log("An Error occured while printing");
        }
        else {
            res.render("campgrounds/campgrounds", {camps:camps, page: "campgrounds"});  // campgrounds.ejs inside campgrounds folder
        }
    });
    
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campgrounds array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var price = req.body.price;
    var newCampground = {name: name, 
        image: image,price:price ,
        description: desc, 
        author:author, 
        location: location, 
        lat: lat, 
        lng: lng,
        likes: 0,
        dislikes: 0
        
    };
    // Create a new campground and save to DB
    Camps.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            
            res.redirect("/campgrounds");
        }
    });
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
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var price = req.body.price;
    
    var newData = {name: req.body.name, image: req.body.image, price:price,description: req.body.description, location: location, lat: lat, lng: lng};
    Camps.findByIdAndUpdate(req.params.id, newData, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
  });
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

// Handling Likes and dislikes 
router.post("/:id/count/:userId/:mode" , function(req,res) {
    Camps.findById(req.params.id, function(err,foundCamp) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            if (req.params.mode==="liked") {
                foundCamp.likes+=1;    
            } else {
                foundCamp.dislikes+=1;
            }
            Users.findById(req.params.userId, function(err,foundUser){
                if (err) {
                    console.log(err);
                }else {
                    console.log(foundCamp._id);
                    foundUser.postsReacted.push(foundCamp._id);
                    console.log(foundUser);
                    foundUser.save();
                    foundCamp.save();
                }
            })
            
            
            res.end();
        }
    });
});



module.exports = router;