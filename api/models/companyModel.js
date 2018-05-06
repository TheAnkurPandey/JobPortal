//Import Mongoose
var mongoose = require('mongoose');

//Company collection

//Create company schema
var CompanySchema = new mongoose.Schema({
    _id: String
});

//Export company model
module.exports =  mongoose.model('Company', CompanySchema );