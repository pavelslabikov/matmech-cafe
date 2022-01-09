//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var tableSchema = new Schema({
    number: Number,
    occupied: Boolean,
    capacity: Number,
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: false },
});

//Export function to create "SomeModel" model class
module.exports = mongoose.model('Table', tableSchema );