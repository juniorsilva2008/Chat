var express    = require('express');
var router = express.Router();

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
router.get('/', function(req, res) {
	
	if(req.session.login){
		User.findById(req.session.login._id, function(err, mycontacts) {
				
			if(err){
				console.log(err);
			}
			else{
				console.log(mycontacts);
				res.render('contacts/index', {title:'My Contacts', mycontacts: mycontacts.contacts, session: req.session.login});
			}

		});


	}else{
		res.redirect('/');
	}
  
});

//Novo usuário
router.get('/new', function(req, res) {

	if(req.session.login){
		res.render('contacts/new', {title:'Add Contact', session: req.session.login});
	
	}else{
		res.redirect('/');
	}
});


//Inserir novo usuário
router.post('/new', function(req, res) {
	
	if(req.session.login){
		User.findById(req.session.login._id, function(err, user) {

			var contact = req.body.contact;
			var contacts = user.contacts;
			contacts.push(contact);
			user.save(function(err){
				if(err){
					console.log(err);
				}
				res.redirect('/contacts');
			});

		});

	
	}else{
		res.redirect('/');
	}


});

//Editar contato
router.get('/edit/:id', function(req, res){

	if(req.session.login){
		User.findById(req.session.login._id, function(err, user){
			var contact = user.contacts.id(req.params.id);
			res.render('contacts/edit', {title:'Edit Contact', contact : contact, message: "", session: req.session.login})
		})

	
	}else{
		res.redirect('/');
	}
});

//Editar usuário
router.post('/edit/:id', function(req, res){
	if(req.session.login){
		User.findById(req.session.login._id, function(err, user){
			var contact  = user.contacts.id(req.params.id);
			contact.name = req.body.contact.name;
			contact.email = req.body.contact.email;
			user.save(function(err){
				if(err){
					console.log(err);
				}else{
					res.render('contacts/edit', {title:'Edit Contact', contact : contact, message: "Contact changed!", session: req.session.login});
				}
			});

			
		});
	
	}else{
		res.redirect('/');
	}
});


module.exports = router;



