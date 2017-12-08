var express = require('express');
var compression = require('compression');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var passport = require('passport');
var mongoose = require('mongoose');

var appConstants = require("./src/server/global_constants/constants");
var route = require("./src/server/index");
var handleServerError = require("./src/server/source/common/error_handler");
var Routes = require("./src/server/routes/main");

var app = express();
app.use(compression());

var dbURI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || appConstants.initServerData.dbURI;
var port =process.env.PORT || appConstants.initServerData.port;
mongoose.connect(dbURI, function (err, res) {
	if (err) {
		console.log ('ERROR connecting to: ' + dbURI + '. ' + err);
	} else {
		console.log ('Succeeded connected to: ' + dbURI);
	}
});

// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});

var store = new MongoDBStore({
	uri: dbURI,
	collection: 'sessions'
});

store.on('error', function(error) {
	console.log(error);
});

app.use(express.static(path.join(__dirname , 'dist')));
app.use(express.static(path.join(__dirname , 'node_modules')));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	next();
});

app.use(session({
	store: store,
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    cookie:{
    	maxAge:1000*60*60*2
    },
    rolling : true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

app.use(expressValidator({
  	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root    = namespace.shift()
		, formParam = root;

	    while(namespace.length) {
	      	formParam += '[' + namespace.shift() + ']';
	    }
	    return {
			param : formParam,
			msg   : msg,
			value : value
	    };
  	}
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/templates'));
app.use("/" , route);

app.use(function(req,res,next){
	if (req.accepts(['html', 'json', 'text']) === "html") {
		Routes.index.call(null,req,res);
	}
	else {
		handleServerError.handleServerError({status:"ERROR" , type:'SERVER_ERROR' , message:"Invalid Resource Request"} , req , res);
	}
});

var server = app.listen(port, function () {
   var host = server.address().address;
   var port = server.address().port;
   console.log("App listening at http://%s:%s", host, port);
});