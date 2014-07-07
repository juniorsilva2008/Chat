
	var mongoose = require('mongoose');
	var env_url = {
		"test": "mongodb://localhost/panictalk_test"	
		, "development": "mongodb://localhost/panictalk"
	};
	//var url = env_url[process.env.NODE_ENV || "development"];
	//return mongoose.connect('mongodb://localhost/panictalk');

module.exports  = mongoose.connect('mongodb://localhost/panictalk');