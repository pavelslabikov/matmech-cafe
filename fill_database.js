#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var customer = require('./models/customer')
var worker = require('./models/worker')
var table = require('./models/table')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var customers = []
var workers = []
var tables = []


customer.deleteMany()
worker.deleteMany()

function customerCreate(name, phone, cb) {
    detail = {
        name: name,
        phone_number: phone
    }

    var newCustomer = new customer(detail);
    newCustomer.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New customer: ' + newCustomer);
        customers.push(newCustomer)
        cb(null, newCustomer)
    }  );
}

function workerCreate(name, cb) {
    detail = {
        name: name
    }

    var newWorker = new worker(detail);
    newWorker.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New customer: ' + newWorker);
        workers.push(newWorker)
        cb(null, newWorker)
    }  );
}

function tableCreate(num, cap, cb) {
    detail = {
        number: num,
        occupied: false,
        capacity: cap
    };

    var newTable = new table(detail);
    newTable.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New customer: ' + newTable);
        tables.push(newTable)
        cb(null, newTable)
    }  );
}

function createCustomers(cb) {
    async.parallel([
            function(callback) {
                customerCreate('test', '123', callback);
            },
            function(callback) {
                customerCreate('pashka', '819', callback);
            }
        ],
        // optional callback
        cb);
}

function createWorkers(cb) {
    async.parallel([
            function(callback) {
                workerCreate('Yess Yee', callback);
            },
            function(callback) {
                workerCreate('Kanye West', callback);
            }
        ],
        // optional callback
        cb);
}

function createTables(cb) {
    async.parallel([
            function(callback) {
                tableCreate(1, 5, callback);
            },
            function(callback) {
                tableCreate(2, 2, callback);
            }
        ],
        // optional callback
        cb);
}


async.series([
        createCustomers,
        createWorkers,
        createTables
    ],
// Optional callback
    function(err, results) {
        if (err) {
            console.log('FINAL ERR: '+err);
        }
        // All done, disconnect from database
        mongoose.connection.close();
    });
