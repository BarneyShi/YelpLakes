var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seed");  
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/routes");
var methodOverride = require("method-override");
var flash = require("connect-flash");
//seedDB();

mongoose.connect("mongodb://localhost:27017/yelp_lakes", {useNewUrlParser: true});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


//=================
//Passport Confg
//=================
app.use(require("express-session")({
	secret: "You got the secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Middleware function to define currentUser
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});

app.use(flash());

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(authRoutes);

app.listen(3000, function() {
	console.log("YelpCamp server connected");
});