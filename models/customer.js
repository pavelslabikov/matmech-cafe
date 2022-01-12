//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var customerSchema = new Schema({
    name: String,
    phone_number: String,
    occupied_table: { type: Schema.Types.ObjectId, ref: 'Table', required: false },
});

module.exports = mongoose.model('Customer', customerSchema );