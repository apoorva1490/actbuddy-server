// Set up
var express = require('express');
var app = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var logger = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');

// Configuration
mongoose.connect('mongodb://localhost/actbuddy');
                                       // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(logger('dev'));
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Models
var Sport = mongoose.model('Sport', {
    id: String,
    name: String,
    category: String,
    icon: String
});

var User = mongoose.model('User', {
    firstname: String,
    lastname: String,
    email: String,
    dob: Date,
    about: String,
    profilepic: String,
    password: String,
    gender: String,
    activities: [
        {
            name: String,
            level: String,
            sportid: String
        }
    ],
    sessions: [
        {
            id: String
        }
    ]
});

var Session = mongoose.model('Session', {
    id: String,
    sportid: String,
    location: String,
    date: Date,
    time: String,
    users: [
        {
            id: String,
            rating: String
        }
    ]
});


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Users

User.remove({}, function (res) {
    console.log("removed records");
});



User.count({}, function (err, count) {
    console.log("Session: " + count);

    if (count === 0) {

        var recordsToGenerate = 10;
        
     


        var firstname = [
            'Jane',
            'John',
            'Mary',
            'Claire',
            'Howard',
            'Manny',
            'Robin',
            'Mark'
        ];

        var gender = [
            '1',
            '2'
        ]

          var lastname = [
            'Janet',
            'Johnson',
            'Millard',
            'Kumar',
            'Nottam',
            'Down',
            'Elon',
            'Twain'
        ];

        var locations = [
            'Bedok',
            'Jurong',
            'Orchard',
            'Woodlands'
        ]

        var dates = [
            '2013-06-14',
            '2016-06-16',
            '2012-06-18',
            '2000-01-11',
            '1990-02-12'
        ]


        var sports = [
            'Tennis',
            'Squash',
            'Soccer',
            'Cycling'
        ];

        // For testing purposes, all rooms will be booked out from:
        // 18th May 2017 to 25th May 2017, and
        // 29th Jan 2018 to 31 Jan 2018

           /*  id: String,
    firstname: String,
    lastname: String,
    email: String,
    dob: Date,
    about: String,
    profilepic: String,
    password: String,
    gender: String,
    activities: */

        for (var i = 0; i < recordsToGenerate; i++) {
            var newUser = new User({
                firstname: firstname[getRandomInt(0, 7)],
                lastname: lastname [getRandomInt(0,7)],
                about: firstname[getRandomInt(0, 7)],
                dob: dates[getRandomInt(0, 4)],
                gender: gender[getRandomInt(0,1)],
                activities: [
                    {
                        id: sports[getRandomInt(0,3)],
                        rating: getRandomInt(0, 5)
                    },
                    {
                        id: sports[getRandomInt(0,3)],
                        rating: getRandomInt(0, 5)
                    }

                ]
                // reserved: [
                //     {from: '1970-01-01', to: '1970-01-02'},
                //     {from: '2017-04-18', to: '2017-04-23'},
                //     {from: '2018-01-29', to: '2018-01-30'}
                // ]
            });

            newUser.save(function (err, doc) {
                console.log("Created test document: " + doc._id);
            });
        }

    }
});


// Session

Session.remove({}, function (res) {
    console.log("removed records");
});

Session.count({}, function (err, count) {
    console.log("Session: " + count);

    if (count === 0) {

        var recordsToGenerate = 150;

        var sports = [
            'Tennis',
            'Squash',
            'Soccer',
            'Cycling'
        ];

        var locations = [
            'Bedok',
            'Jurong',
            'Orchard',
            'Woodlands'
        ]

        var dates = [
            '2017-06-14',
            '2017-06-16',
            '2017-06-18'
        ]

        // For testing purposes, all rooms will be booked out from:
        // 18th May 2017 to 25th May 2017, and
        // 29th Jan 2018 to 31 Jan 2018

        for (var i = 0; i < recordsToGenerate; i++) {
            var newSession = new Session({
                id: i,
                sportid: sports[getRandomInt(0, 3)],
                location: locations[getRandomInt(0, 3)],
                date: dates[getRandomInt(0, 2)],
                users: [
                    {
                        id: i,
                        rating: getRandomInt(0, 5)
                    },
                    {
                        id: i + 1,
                        rating: getRandomInt(0, 5)
                    }

                ]
                // reserved: [
                //     {from: '1970-01-01', to: '1970-01-02'},
                //     {from: '2017-04-18', to: '2017-04-23'},
                //     {from: '2018-01-29', to: '2018-01-30'}
                // ]
            });

            newSession.save(function (err, doc) {
                console.log("Created test document: " + doc._id);
            });
        }

    }
});


    // Routes

    // Get sessions
    app.get('/api/sessions', function (req, res) {

        console.log("fetching sessions");

        // use mongoose to get all sessions in the database
        Session.find(function (err, sessions) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(sessions); // return all sessions in JSON format
        });
    });

    //Get session for user
    app.post('/api/session/user', function (req, res) {

        Session.find({
            id: req.body.id,
            // beds: req.body.beds,
            // max_occupancy: {$gt: req.body.guests},
            // cost_per_night: {$gte: req.body.priceRange.lower, $lte: req.body.priceRange.upper},
            // reserved: { 

            //     //Check if any of the dates the room has been reserved for overlap with the requsted dates
            //     $not: {
            //         $elemMatch: {from: {$lt: req.body.to.substring(0,10)}, to: {$gt: req.body.from.substring(0,10)}}
            //     }

            // }
        }, function (err, sessions) {
            if (err) {
                res.send(err);
            } else {
                res.json(sessions);
            }
        });

    });

    // Get Sports
    app.get('/api/sports', function (req, res) {

        console.log("fetching sports");

        // use mongoose to get all sessions in the database
        Sport.find(function (err, sports) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(sports); // return all sessions in JSON format
        });
    });

    //Add sport to user list

    app.post('/api/users/addsport', function(req, res) {
 
        console.log(req.body._id);
 
        User.findByIdAndUpdate(req.body._id, {
            $push: {"activities": {name: req.body.name, level: req.body.level, sportid: req.body.sportid}}
        }, {
            safe: true,
            new: true
        }, function(err, user){
            if(err){
                res.send(err);
            } else {
                res.json(user);
            }
        });
 
    });

    // create session and send back all session after creation
    app.post('/api/create/session', function (req, res) {

        console.log("creating session");

        // create a session, information comes from request from Ionic
        Session.create({
            sportid: req.body.sportid,
            location: req.body.location,
            date: req.body.date,
            users: req.body.users
        }, function (err, review) {
            if (err)
                res.send(err);

            // get and return all the reviews after you create another
            Session.find(function (err, sessions) {
                if (err)
                    res.send(err)
                res.json(sessions);
            });
        });

    });

    // delete a review
    app.delete('/api/reviews/:review_id', function (req, res) {
        Review.remove({
            _id: req.params.review_id
        }, function (err, review) {

        });
    });


    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");
