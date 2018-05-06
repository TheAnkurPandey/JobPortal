//Import Mongoose
var mongoose = require('mongoose');

//Student collection

//Create student schema
var StudentSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    department: String,
    cgpa: Number,
    interestedCompanies: {
        type: [String],
        required: false
    }
});

//Export student model
module.exports = mongoose.model('Student', StudentSchema );