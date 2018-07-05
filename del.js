var mongoose = require('mongoose');
var async = require('async');
var _ = require('lodash');
var dbUri = "mongodb://localhost:27017/b05901041";
mongoose.connect(dbUri, function () {
    var db = mongoose.connection.db;
    db.collections(function (err, collections) {
        var collectionsWithoutSystem = _.filter(collections, function (collection) {
            return collection.collectionName.split('.')[0] !== 'system';
        });
        async.forEach(
            collectionsWithoutSystem,
            function (collection, done) {
                collection.remove({}, function (err) {
                    if (err) return done(err);
                    done(null);
                });
            },
            function (err) {
                mongoose.connection.close(function () { });
            });
    });
});