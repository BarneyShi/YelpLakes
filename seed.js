var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data =[
	{
		name: "Maraine Lake",
		image: "https://az837918.vo.msecnd.net/publishedimages/Listings/1209/en-CA/images/1/moraine-lake-L-10.jpg",
		description: "The most beautiful lake in AB."
	},{
		name: "Peyto Lake",
		image:"https://az837918.vo.msecnd.net/publishedimages/Listings/1483/en-CA/images/1/peyto-lake-L-12.jpg",
		description: "Another beautiful lake in AB"
	}, {
		name: "Malingine Lake",
		image:"https://az837918.vo.msecnd.net/publishedimages/Listings/1207/en-CA/images/1/maligne-lake-L-14.jpg",
		description: "Beautiful Lake in BC"
	}
];

function seedDB(){
	Campground.deleteMany({}, function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("remove campgrounds");
		}
	});
	
	data.forEach(function(seed){
		Campground.create(seed, function(err,campground) {
			if(err) {
				console.log(err);
			} else {
				console.log("added a campground");
				//create Comment
				Comment.create({
					text: "This is a new comment",
					author: "barney"
				}, function(err,comment) {
					if (err) {
						console.log(err);
					} else {
						campground.comments.push(comment);
					campground.save();
						console.log("Created a new comment");
					}
				});
			}
		});
	});
}

module.exports = seedDB;