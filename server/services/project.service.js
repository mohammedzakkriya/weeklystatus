var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('projects');

var service = {};

//service.authenticate = authenticate;
service.getAll = getAll;
//service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAll() {
    var deferred = Q.defer();

    db.projects.find().toArray(function (err, projects) {
        if (err) deferred.reject(err.name + ': ' + err.message);


        deferred.resolve(projects);
    });

    return deferred.promise;
}

function create(project_user) {
    var deferred = Q.defer();
    task.date = new Date();
    db.projects.insert(project_user, function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });
    return deferred.promise;
}

function update(_id, project_user) {
        // fields to update
     var deferred = Q.defer();
    var set = {
        projectname: project_user.projectname,
        //date: new Date(),
        user: project_user.user
    };
    //console.log('set:',set);
    db.projects.update(
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

    db.project_user.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}