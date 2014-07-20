var express    = require('express');
var router = express.Router();
var authentication = require('../middleware/authentication');

//var mongoose     = require('mongoose');
//mongoose.connect('mongodb://localhost/panictalk');

var User = require('../models/user');

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	//console.log(User);
	next(); // make sure we go to the next routes and don't stop here
});

//initial
router.get('/:email/:room', authentication, function(req, res) {
	User.findOne({email:req.params.email}, function(err, contact) {
		if(err)
			console.log(err);
		else
			res.render('chat/index', {title: contact.name , chatto: contact.email, session: req.session.login, room: req.params.room});
	});
});

module.exports = router;
