var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
//All img are 400*300;
router.get('/', function(req, res) {
    //get data from DB
    Campground.find({}, function(err, allcampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/campgrounds', { campgrounds: allcampgrounds });
        }
    });

    //res.render("campgrounds",{campgrounds: campgrounds});
});
router.post('/', isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = { name: name, image: image, description: desc, author: author };
    //campgrounds.push(newCampground);
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        }
        {
            console.log(newlyCreated);
            res.redirect('/campgrounds');
        }
    });
});
router.get('/new', isLoggedIn, function(req, res) {
    res.render('campgrounds/new.ejs');
});

router.get('/:id', function(req, res) {
    Campground.findById(req.params.id)
        .populate('comments')
        .exec(function(err, foundCampground) {
            if (err) {
                console.log(err);
            } else {
                console.log(foundCampground);
                res.render('campgrounds/show', { campground: foundCampground });
            }
        });
});

//Edit Campground
router.get('/:id/edit', checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});
//Update Router
router.put('/:id',checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
        err,
        updatedCampground
    ) {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});
//===========
//Delete Route
//===========
router.delete('/:id',checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                res.redirect('back');
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.render('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}

module.exports = router;