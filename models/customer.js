//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var customerSchema = new Schema({
    name: String,
    phone_number: String
});

module.exports = mongoose.model('Customer', customerSchema );