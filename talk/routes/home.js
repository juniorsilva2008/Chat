var express    = require('express');
var router = express.Router();
var authentication = require('../middleware/authentication');

var mongoose     = require('mongoose');
mongoose.connect('mongodb://187.2.55.247/panictalk');

var User = require('../models/user');



// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	//console.log(User);

	next(); // make sure we go to the next routes and don't stop here
});

//initial
router.get('/', function(req, res) {
  	res.render("home/index", { title: 'Panic Talk 1.0', subTitle: 'Messages not stored!', session: req.session.login});
});


//Login sucessfull
router.get('/mychat',authentication, function(req, res) {
  	res.render("home/index", { title: 'My PT 1.0', subTitle: 'Olá ' + req.session.login.name,  session: req.session.login});
});


//Sair so sistema
router.get('/mychat/logout', function(req, res) {
	req.session.destroy();
	res.redirect('/');
});

//Post da página inicial para fazer o login
router.route('/')
.post(function(req, res) {

	var user = req.body.login;
	var query = {email: user.email, password: user.password};
	
	//Se for clicado no botão de login, efetua login
	//Se nao, cadastra novo usuário
	if(user.btn_login==1)
	{
		User.findOne(query, function(err, user){
			if(err)
				console.log(err);

			if(user != null){
				req.session.login = user;
				res.redirect('/mychat');
			}
			else
			{
				console.log('Nao localizado!');
				res.render("home/index", { title: 'Panic Talk 1.0', subTitle: 'Sorry, Login Failed!', session: req.session.login });
			}
		});

	}else{
		user.name = user.email.substring(0, user.email.indexOf("@"));
		User.create(user, function(err, user){
			if(err)
				res.redirect("/");

			req.session.login = user;
			res.redirect('/mychat');
		})
	}



});



//Sobre
router.get('/about', function(req, res) {
  	res.render("home/about", { title: 'About us', session: req.session.login});
});


module.exports = router;

