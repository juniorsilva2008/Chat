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
router.get('/:id', authentication, function(req, res) {
	User.findById(req.session.login._id, function(err, mycontacts) {
		if(err){
			console.log(err);
		}
		else{
			var contact = mycontacts.contacts.id(req.params.id)
			res.render('chat/index', {title: contact.email, mycontacts: mycontacts.contacts, session: req.session.login});
		}
	});
});

module.exports = router;
