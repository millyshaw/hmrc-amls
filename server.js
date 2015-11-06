var path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    basicAuth = require('basic-auth-connect'),
    session = require('express-session'),
    favicon = require('serve-favicon'),
    routes = require(__dirname + '/app/routes.js'),
    app = express(),
    port = (process.env.PORT || 3000),

// Grab environment variables specified in Procfile or as Heroku config vars
    username = process.env.USERNAME,
    password = process.env.PASSWORD,
    env = process.env.NODE_ENV || 'development';

// Authenticate against the environment-provided credentials, if running
// the app in production (Heroku, effectively)
if (env === 'production') {
  if (!username || !password) {
    console.log('Username or password is not set, exiting.');
    process.exit(1);
  }
  app.use(basicAuth(username, password));
}

app.use(favicon(path.join(__dirname, 'govuk_modules', 'govuk_template', 'assets', 'images','favicon.ico'))); 

app.use(bodyParser.urlencoded({extended : true}));

app.use(session({
    secret : 'snail'
}));


// Application settings
app.engine('html', require('./lib/template-engine.js').__express);
app.set('view engine', 'html');
app.set('vendorViews', path.join(__dirname, 'govuk_modules', 'govuk_template', 'views', 'layouts'));
app.set('views', path.join(__dirname, 'app', 'views'));

// Middleware to serve static assets
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'govuk_modules', 'govuk_template', 'assets')));
app.use('/public', express.static(path.join(__dirname, 'govuk_modules', 'govuk_frontend_toolkit')));

// send assetPath to all views
app.use(function (req, res, next) {
  res.locals.assetPath = '/public/';
  next();
});

// if it doesn't exist, pass the request on to app/routes.js
routes.bind(app);

// auto render any view that exists
app.get(/^\/([^.]+)$/, function (req, res, next) {
	var path = (req.params[0]);
	res.render(path, function(err, html) {
		if (err) {
			next();
		} else {
			res.end(html);
		}
	});
});

// start the app
app.listen(port);
console.log('');
console.log('Listening on port ' + port);
console.log('');
