module.exports = function(req, res, next){
	if(!req.session.login){
		res.redirect('/');
	}
	return next();
};