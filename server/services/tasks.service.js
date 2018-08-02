var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('tasks');

var service = {};

//service.authenticate = authenticate;
service.getAll = getAll;
service.getAllPendingTasks = getAllPendingTasks;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAll(firstday, lastday, user, role) {
    var deferred = Q.defer();
    /*
    db.tasks.find().toArray(function (err, tasks) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(tasks);
    });
    */
   var queryObj;
   var curr = new Date;
   // var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
   // var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6));
    //console.log('first day:',firstday);
   // console.log('last day:',lastday);
    if(role=='user') {
        queryObj = {
            user: user,
            date: {
                $gte: new Date(firstday),
                $lt: new Date(lastday)
            }
        }
    } else {
        queryObj = {
            date: {
                $gte: new Date(firstday),
                $lt: new Date(lastday)
            }
        }
    }
    //console.log('query:',queryObj);
    var mysort = { user: 1, status: 1 };
    db.tasks.find(queryObj).sort(mysort).toArray(function(err, task){
        if (err) deferred.reject(err.name + ': ' + err.message);
        console.log('task:', task);
        deferred.resolve(task);
    });
   
    return deferred.promise;
}

function getAllPendingTasks(firstday, lastday, user, role) {
    var deferred = Q.defer();
    /*
    db.tasks.find().toArray(function (err, tasks) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(tasks);
    });
    */
   var queryObj;
   var curr = new Date;
   // var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
   // var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6));
    console.log('first day:',firstday);
    console.log('last day:',lastday);
    if(role=='user') {
        queryObj = {
            user: user,
            status: {$ne: "completed"},
            date: {
                $lt: new Date(firstday)
            }
        }
        var mysort = { user: 1, status: 1 };
       
    } else {
        queryObj = {
            status: {$ne:"completed"},
            date: {
                $lt: new Date(firstday)
            }
        }
        var mysort = { user: 1, status: 1 };
    }
    db.tasks.find(queryObj).sort(mysort).toArray(function(err, task){
        if (err) deferred.reject(err.name + ': ' + err.message);
        console.log('task:', task);
        deferred.resolve(task);
    });
    console.log('query:',queryObj);
    
   
    return deferred.promise;
}


function getById(_id) {
    var deferred = Q.defer();

    db.tasks.findById(_id, function (err, task) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (task) {
            // return user (without hashed password)
            deferred.resolve(task);
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(task) {
    var deferred = Q.defer();
    task.date = new Date();
    db.tasks.insert(task, function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });
    return deferred.promise;
}

function update(_id, task) {
        // fields to update
     var deferred = Q.defer();
    var set = {
        title: task.title,
        date: new Date(),
        status: task.status,
        project: task.project,
    };
    //console.log('set:',set);
    db.tasks.update(
        { _id: mongo.helper.toObjectID(_id) },
        { $set: set },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });
    return deferred.promise;
}

   

function _delete(_id) {
    var deferred = Q.defer();

    db.tasks.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}