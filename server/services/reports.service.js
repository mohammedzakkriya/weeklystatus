var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('reports');

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

    db.reports.find().toArray(function (err, reports) {
        if (err) deferred.reject(err.name + ': ' + err.message);


        deferred.resolve(reports);
    });

    return deferred.promise;
}

function create(report_user) {
    var deferred = Q.defer();
    report_user.date = new Date();
    db.reports.insert(report_user, function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });
    return deferred.promise;
}

function update(_id, report_user) {
        // fields to update
     var deferred = Q.defer();
    var set = {
        reportByActivities: report_user.reportByActivities,
        date: new Date(),
        user: report_user.user
    };
    //console.log('set:',set);
    db.reports.update(
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

    db.reports.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}