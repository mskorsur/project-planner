const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
const mongoose = require('mongoose');

//API endpoints handler
const projectPlannerApiHandler = require('./routes/projectPlannerApiHandler');

const app = express();

//Mongoose and MongoDB setup
let connectionURI = '';
process.env.NODE_ENV === 'test'
? connectionURI = 'mongodb://test-pp:pp1234@ds263740.mlab.com:63740/pp-test'
: connectionURI = 'mongodb://marin-pp:pp1234@ds161520.mlab.com:61520/project-planner';
mongoose.connect(connectionURI).then(
    () => { if (process.env.NODE_ENV !== 'test') console.log('MongoDB connection success') },
    err => { console.error.bind(console, 'MongoDB connection error: ' + err) }
);
mongoose.Promise = global.Promise;

//Route agnostic middleware
if (process.env.NODE_ENV !== 'test') app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.disable('x-powered-by');

//Mount specific API routes to matching handlers
app.use('/api', projectPlannerApiHandler);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
  
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err);
    // render the error page
    res.status(err.status || 500);
    res.send('error' + err);
});

module.exports = app;
