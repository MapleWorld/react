var path				= require('path');
var react 				= require('react');
var logger				= require('morgan');
var express				= require('express');
var bodyParser			= require('body-parser');
var cookieParser		= require('cookie-parser');
var flash				= require('connect-flash');
var favicon				= require('serve-favicon');
var session				= require('express-session');
var expressValidator	= require('express-validator');
var connection			= require('express-myconnection');

var app					= express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

/*
app.engine('html', require('ejs').__express);
app.set('views','./views');
app.set('view engine','html');
*/

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser('secretString'));

app.use(session({
	cookieName: "session",
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	secret: 'Lonely Boy',
	resave: true,
	saveUninitialized: true,
	cookie: {maxAge: 3600000}
	}	
));
app.use(flash());

var home 			= require('./routes/home');
var index			= require('./routes/index');
var install 		= require('./routes/install');
var feature 		= require('./routes/feature');

app.use('/', home);
app.use('/', index);
app.use('/', install);
app.use('/', feature);

var server = app.listen(8080,function(){
   console.log("Listening to port %s",server.address().port);
});
