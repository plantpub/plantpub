var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
var db = new mongodb.Db('plantpub', server, {safe: true});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});
router.get('/about', function (req, res, next) {
    res.render('about', {title: 'Express'});
});
router.get('/posts', function (req, res, next) {
    console.log(req.query.page);
    //

    db.open(function (err, db) {
        if (!err) {
            console.log('connect');
            db.collection('blogs', {safe: true}, function (err, collection) {
                if (err) {
                    console.log(err);
                } else {
                    collection.find().toArray(function (err, docs) {
                        console.log('find');
                        console.log(docs);

                        res.render('posts', {title: 'posts',blogs:docs});
                    });
                }
            });

        } else {
            console.log(err);
        }

    });
    //

});

module.exports = router;
