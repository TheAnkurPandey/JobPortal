//STEP:1 Imports Modules
var express =require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');

//STEP:2 Imports Routes
var studentRoutes = require('./api/routes/studentRoutes');
var companyRoutes = require('./api/routes/companyRoutes');

var app = express();

//STEP:3 Connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/JobPortal');

//STEP:4 Middle-Ware
app.use(logger('combined'));//Morgan for printing logs
app.use(bodyParser.urlencoded({extended: true})); //Configure api for bodyParser()
app.use(bodyParser.json()); //Let us grab the data from body of POST
app.use(expressValidator({ //custom express validator
    customValidators: {
        in: function(value) {
            var validDepartments = ["information technology", "computer science", "electronics", "mechanical"];
            return (validDepartments.indexOf(value) > -1)
        },
        isValidChars: function (value) {
            value = value.toLowerCase();
            var charactersArr = value.split('');
            var validCharacters = 'abcdefghijklmnopqrstuvwxyz '.split('');

            charactersArr.forEach(char => {
                if (validCharacters.indexOf(char) === -1) {
                    return false;
                }
            });
            return true;
        }
    }
}));

app.use('/students', studentRoutes);
app.use('/companies', companyRoutes);

//STEP:5 Handled error of non-existing routes
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use(function (err, req, res, next) {
    var error = err;
    var status = err.status || 500;
    res.status(status).json({
        error: {
          message: error.message
        }
    });
});

//STEP:6 Handled uncaught exceptions
process.on('uncaughtException', function (err, req, res) {
    console.log(err);
});

//STEP:7 Fire up the server
var port = process.env.port || 1000; //Set up port for server to listen on
app.listen(port, function () {
  console.log('App listening on port', port);
});
