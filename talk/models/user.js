
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var contacts = Schema({
	name: String
	, email: String
});

var UserSchema = Schema({
	name: {type: String, required: true}
	, email: {type: String, required: true, index: {unique: true}}
	, password: {type: String, required: true}
	, contacts: [contacts]
});

module.exports =  mongoose.model('users', UserSchema);


