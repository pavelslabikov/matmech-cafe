//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var workerSchema = new Schema({
    name: String
});

//Export function to create "SomeModel" model class
module.exports = mongoose.model('Worker', workerSchema );