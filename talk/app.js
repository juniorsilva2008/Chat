var express = require('express');
var load = require('express-load');
var session = require('express-session')
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/home');
var contacts = require('./routes/contacts');


var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//Sessão
const KEY = 'Panictalk.sid', SECRET = 'Panictalk';
var cookie = cookieParser(SECRET)
    , store = new session.MemoryStore()
    , sessOpts = {secret: SECRET, key: KEY, store: store}
    , session = session(sessOpts);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session);
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/contacts', contacts);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


load('sockets')
    .into(io);


app.set('port', process.env.PORT || 3000);

server.listen(app.get('port'), function(){
    console.log("Panic no ar: "  + server.address().port);
});

module.exports = app;
