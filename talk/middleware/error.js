exports.notFound = function(req, res, next) {
	res.status(404);
	res.render('not-found',  {title: 'Panic Talk 1.0', session: req.session.login});
};

exports.serverError = function(error, req, res, next) {
	res.status(500);
	res.render('server-error', { title: 'Panic Talk 1.0', error: error,  session: req.session.login});
};