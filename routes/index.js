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

                        var session=req.session;
                        console.dir(session.userDoc);
                        if(session.userName){
                            res.render('user_index', {title: 'posts',userDoc:session.userDoc, blogs: docs});
                        }else{
                            res.render('index', {title: 'posts',blogs: docs});
                        }

                    });
                }
            });

        } else {
            console.log(err);
        }

    });
});
router.get('/login', function (req, res, next) {
    var session=req.session;
    if(session.userName){
        res.render('user_index', {userDoc:session.userDoc});
    }else{
        res.render('login', {});
    }
});
router.get('/logout', function (req, res, next) {
    var session=req.session;
    session.userDoc=null;
    session.userName=null;
    res.render('logout_success', {});
});
router.post('/login', function (req, res, next) {
    var session=req.session;
    var user = req.body.user;
    var pass = req.body.pass;
    db.open(function (err, db) {
        if (!err) {
            console.log('connect');
            db.collection('users', {safe: true}, function (err, collection) {
                if (err) {
                    console.log(err);
                } else {
                    collection.findOne({name:user,pass:pass},function (err, doc) {
                        console.log('find');
                        console.log(doc);
                        if(doc){
                            session.userDoc=doc;
                            session.userName=user;
                            res.render('login_success', {title: 'posts', blogs: doc});
                        }else{
                            res.render('login_error', {title: 'posts', blogs: doc});
                        }
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
    var session=req.session;
    if(session.userName){
        res.render('add', {userDoc:session.userDoc});
    }else{
        res.render('login', {});

    }
});
router.post('/addpost', function (req, res, next) {
    var title = req.body.title;
    var text = req.body.text;
    //
    db.open(function (err, db) {
        if (!err) {
            console.log('connect');
            db.collection('blogs', {safe: true}, function (err, collection) {
                if (err) {
                    console.log(err);
                } else {
                    collection.save({title: title, text: text},function (err, docs) {

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
router.post('/editpost', function (req, res, next) {
    var title = req.body.title;
    var text = req.body.text;
    var obj_id = req.body.obj_id;
    obj_id = mongodb.ObjectId(obj_id);

    //
    db.open(function (err, db) {
        if (!err) {
            console.log('connect');
            db.collection('blogs', {safe: true}, function (err, collection) {
                if (err) {
                    console.log(err);
                } else {
                    collection.updateOne({_id: obj_id}, {title: title, text: text},function (err, docs) {

                    });
                }
            });

        } else {
            console.log(err);
        }

    });
    //
    res.render('editpost_ok', {obj_id: obj_id});
});
router.get('/delpost/*', function (req, res, next) {
    var request_url = req.path;
    var request_url_arr = request_url.split("/");
    var obj_id = request_url_arr[request_url_arr.length - 1];
    obj_id = mongodb.ObjectId(obj_id);

    var session=req.session;
    if(session.userName){
        db.open(function (err, db) {
            if (!err) {
                console.log('connect');
                db.collection('blogs', {safe: true}, function (err, collection) {
                    if (err) {
                        console.log("err:"+err);
                        res.render('delpost_error', {msg: 'collection err'});
                    } else {
                        collection.removeOne({_id: obj_id},function (err, docs) {
                            if(err){
                                res.render('delpost_error', {msg: 'Express'});
                            }else{
                                res.render('delpost_ok', {msg: 'ok'});
                            }
                        });
                    }
                });

            } else {
                console.log(err);
                res.render('delpost_error', {msg: 'db open err'});
            }

        });

    }else{
        res.render('delpost_error', {msg: 'u cant del post'});
    }
    //

    //

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

                        res.render('posts', {title: 'posts', blogs: docs});
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
    var request_url = req.path;
    var request_url_arr = request_url.split("/");
    var obj_id = request_url_arr[request_url_arr.length - 1];
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

                    obj_id = mongodb.ObjectId(obj_id);

                    //
                    collection.find({_id: obj_id}).toArray(function (err, docs) {
                        console.log('find');
                        //console.log(docs);
                        var session=req.session;
                        if(session.userName){
                            res.render('user_post', {obj_id:obj_id,userDoc:session.userDoc,post: docs[0]});
                        }else{
                            res.render('post', {post: docs[0]});
                        }

                    });
                }
            });

        } else {
            console.log(err);
        }

    });
    //


});


router.get('/edit/*', function (req, res, next) {
    console.log(req.path);
    var request_url = req.path;
    var request_url_arr = request_url.split("/");
    var obj_id = request_url_arr[request_url_arr.length - 1];
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
                    obj_id = mongodb.ObjectId(obj_id);
                    //
                    collection.find({_id: obj_id}).toArray(function (err, docs) {
                        console.log('find');
                        //console.log(docs);
                        res.render('edit', {post: docs[0]});
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
