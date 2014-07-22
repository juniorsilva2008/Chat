var express       = require('express');
var load          = require('express-load');
var expressSession  = require('express-session')
var path          = require('path');
var favicon       = require('static-favicon');
var logger        = require('morgan');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var error         = require('./middleware/error');

//Rotas
var routes        = require('./routes/home');
var contacts      = require('./routes/contacts');
var chat          = require('./routes/chat');


var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
//io.use( ss );


//Sessão
const KEY = 'PanicTalk.sid', SECRET = 'PanicTalk';
var cookie = cookieParser(SECRET)
    , store = new expressSession.MemoryStore()
    , sessOpts = {secret: SECRET, key: KEY, store: store,  resave: true, saveUninitialized: true,  proxy: null}
    , session = expressSession(sessOpts);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookie);
app.use(session);
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));


//Passa a sessão do express para o socket.io
io.use(function(socket, next) {
  var handshake = socket.handshake || {};
  if (handshake.headers && handshake.headers.cookie) {
      cookie(handshake, {}, function (err) {
      handshake.sessionID =  handshake.signedCookies[KEY];
      handshake.sessionStore = store;
      handshake.sessionStore.get(handshake.sessionID, function (err, data) {
        if (err) return console.log(err);
        if (!data) return console.log('Invalid Session');
        handshake.session = new expressSession.Session(handshake, data);
        next()
      });
    });
  }
  else {
    console.log('Missing Cookies');
  }
});




//Rotas
app.use('/', routes);
app.use('/contacts', contacts);
app.use('/chat', chat);
app.use(error.notFound);
//app.use(error.serverError);


/*
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
;*/
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
})




//Carrega a pasta de sockets
load('sockets')
    .into(io);


app.set('port', process.env.PORT || 80);

server.listen(app.get('port'), function(){
    console.log("Panic no ar: "  + server.address().port);
});

module.exports = app;
