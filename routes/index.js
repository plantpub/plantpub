var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true});
var db = new mongodb.Db('plantpub', server, {safe: true});

/* GET home page. */
router.get('/', function (req, res, next) {
    db.open(function (err, db) {
        if (!err) {
            console.log('connect');
            db.collection('blogs', {safe: true}, function (err, collection) {
                if (err) {
                    console.log(err);
                } else {
                    collection.find().toArray(function (err, docs) {
                        console.log('find');
                        //console.log(docs);

                        res.render('index', {title: 'posts',blogs:docs});
                    });
                }
            });

        } else {
            console.log(err);
        }

    });
});
router.get('/about', function (req, res, next) {
    res.render('about', {title: 'Express'});
});
router.get('/zp', function (req, res, next) {
    res.render('zp', {title: 'Express'});
});
router.get('/add', function (req, res, next) {
    res.render('add', {title: 'Express'});
});
router.post('/addpost', function (req, res, next) {
    var title=req.body.title;
    var text=req.body.text;
    //
    db.open(function (err, db) {
        if (!err) {
            console.log('connect');
            db.collection('blogs', {safe: true}, function (err, collection) {
                if (err) {
                    console.log(err);
                } else {
                    collection.save({title:title,text:text})(function (err, docs) {

                    });
                }
            });

        } else {
            console.log(err);
        }

    });
    //
    res.render('addpost_ok', {title: 'Express'});
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
                        //console.log(docs);

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
router.get('/post/*', function (req, res, next) {
    console.log(req.path);
    var request_url=req.path;
    var request_url_arr=request_url.split("/");
    var obj_id=request_url_arr[request_url_arr.length-1];
    console.log(obj_id);

    //
    db.open(function (err, db) {
        if (!err) {
            console.log('connect');
            db.collection('blogs', {safe: true}, function (err, collection) {
                if (err) {
                    console.log(err);
                } else {
                    //

                    obj_id=mongodb.ObjectId(obj_id);

                    //
                    collection.find({_id:obj_id}).toArray(function (err, docs) {
                        console.log('find');
                        //console.log(docs);
                        res.render('post', {post:docs[0]});
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
