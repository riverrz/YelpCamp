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
    // console.log(req.query);
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Camps.find({name: regex}, function(err, camps) {
            if (err) {
                console.log("An Error occured while printing");
            }
            else {
                if(camps.length<1) {
                    req.flash("error", "No matching campground's found!");
                    res.redirect("back");
                } else {
                    res.render("campgrounds/campgrounds", {camps:camps, page: "campgrounds"});  // campgrounds.ejs inside campgrounds folder    
                }
            }
        });
    }else {
        Camps.find({}, function(err, camps) {
            if (err) {
                console.log("An Error occured while printing");
            }
            else {
                res.render("campgrounds/campgrounds", {camps:camps, page: "campgrounds"});  // campgrounds.ejs inside campgrounds folder    
            }
        });
    }
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

    Camps.findById(req.params.id, function(err,foundCamp){
        if(err) {
            console.log(err);
            req.flash("error", "Couldn't do this event, some error occured");
            res.redirect("back");
        } else{
            Users.findById(req.params.userId, function(err, foundUser){
                var result = {likes: 0 , dislikes: 0 , extra:0};
                if(err) {
                    console.log(err);
                }else {
                    var index = foundUser.postsReacted.findIndex(function(post){
                        return foundCamp._id.equals(post.id);
                    });
                    if (index===-1) {
                        foundUser.postsReacted.push({id: req.params.id, reaction: String(req.params.mode)});
                        foundCamp[req.params.mode]+=1
                    } else {
                        if(foundUser.postsReacted[index].reaction === req.params.mode) {
                            foundUser.postsReacted.splice(index,1);
                            foundCamp[req.params.mode]-=1;
                            result.extra=1;
                            
                        } else {
                            var opposite={"likes":"dislikes", "dislikes":"likes"};
                            var updatedPostsReacted = JSON.parse(JSON.stringify(foundUser.postsReacted));
                            updatedPostsReacted[index].reaction = String(req.params.mode);
                            foundUser.set({postsReacted: updatedPostsReacted});
                            foundCamp[req.params.mode]+=1;
                            foundCamp[opposite[req.params.mode]]-=1;
                        }
                    }
                    foundUser.save(function(err){
                        if(err){
                            console.log(err)
                        }else {
                            foundCamp.save(function(err){
                                if(err){
                                    console.log(err);
                                }else {
                                    result.likes= foundCamp.likes;
                                    result.dislikes= foundCamp.dislikes;
                                    res.send(JSON.stringify(result));
                                }
                            });
                        }
                    })
                }
            })
            
            
        }
    })
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;