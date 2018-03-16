var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    Camps       = require("./models/campgrounds"),
    seedDB      = require("./seed"),
    methodOverride = require("method-override"),
    passport    = require("passport"),
    LocalStrategy   = require("passport-local"),
    User        = require(__dirname+"/models/user"),
    Comment     = require("./models/comment");
   // Requiring Routes
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes          = require("./routes/index");


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

// console.log(process.env.DATABASEURL); // Created an environment variable using export <var name>=<url> , for local it is different and for heroku its different.
mongoose.connect(process.env.DATABASEURL);
// mongoose.connect("mongodb://shivam123425:yelpcamp@ds215709.mlab.com:15709/yelpcamp123425");

// Seed the database
// seedDB();

app.use(methodOverride("_method")); // use methodOverride and look for _method in query string
app.use(flash());



//PASSPORT CONFIGURATIONS
app.use(require("express-session")({
    secret: "Why is authentication such a pain??",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {        // This is used to add currentUser to every route so we can access it to find if user is logged in or not
    res.locals.currentUser = req.user;
    res.locals.error= req.flash("error");   // Adding the flash message to every route
    res.locals.success= req.flash("success");   // Adding the flash message to every route
    next();
});

app.use("/",indexRoutes);    // This tells to use those route files, in this the routes have / as common (it didnt make any difference but just the sake of practice.)
app.use("/campgrounds/:id/comments",commentRoutes);     // In these routes the common prefix are /campgrounds/:id/comments , so in the file the routes are only /new , after concat they become /campgrounds/:id/comments/new etc.
app.use("/campgrounds",campgroundRoutes);   // All routes were starting with /campgrounds so we add /campgrounds and in campgroundRoutes we just keep / or /new etc. which results in /campgrounds/new etc after concat.



app.listen(process.env.PORT , process.env.IP, function() {
    console.log("Server has started");
});