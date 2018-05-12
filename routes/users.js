var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var listUser = require('../models/users.js').User;

var MongoClient = require('mongodb').MongoClient;
// Connection URL
//var url = 'mongodb://localhost:27017';
//var url = 'mongodb://Users:nnlinh97.@ds119080.mlab.com:19080';
//server: ds119080.mlab.com
//port: 19080
// Database Name

const url = process.env.MONGODB_URL || 'mongodb://localhost:27017';

const dbName = process.env.MONGODB_NAME || 'QLNS';
//var dbName = 'nnlinh97';

var listUser = [
  {
    "email": "melany.wijngaard@example.com",
    "gender": "female",
    "phone_number": "(727)-033-9347",
    "birthdate": 608022796,
    "location": {
      "street": "2431 predikherenkerkhof",
      "city": "staphorst",
      "state": "gelderland",
      "postcode": 64265
    },
    "username": "bigpeacock217",
    "password": "eagle",
    "first_name": "melany",
    "last_name": "wijngaard",
    "title": "miss",
    "picture": "women/70.jpg"
  },
  {
    "email": "nanna.pedersen@example.com",
    "gender": "female",
    "phone_number": "43672992",
    "birthdate": 591428535,
    "location": {
      "street": "2177 fåborgvej",
      "city": "aarhus",
      "state": "syddanmark",
      "postcode": 87547
    },
    "username": "purpleduck599",
    "password": "davids",
    "first_name": "nanna",
    "last_name": "pedersen",
    "title": "ms",
    "picture": "women/68.jpg"
  },
];

/* GET users listing. */
router.get('/', function (req, res, next) {
  var listUser = [
    {
      "email": "melany.wijngaard@example.com",
      "gender": "female",
      "phone_number": "(727)-033-9347",
      "birthdate": 608022796,
      "location": {
        "street": "2431 predikherenkerkhof",
        "city": "staphorst",
        "state": "gelderland",
        "postcode": 64265
      },
      "username": "bigpeacock217",
      "password": "eagle",
      "first_name": "melany",
      "last_name": "wijngaard",
      "title": "miss",
      "picture": "women/70.jpg"
    },
    {
      "email": "nanna.pedersen@example.com",
      "gender": "female",
      "phone_number": "43672992",
      "birthdate": 591428535,
      "location": {
        "street": "2177 fåborgvej",
        "city": "aarhus",
        "state": "syddanmark",
        "postcode": 87547
      },
      "username": "purpleduck599",
      "password": "davids",
      "first_name": "nanna",
      "last_name": "pedersen",
      "title": "ms",
      "picture": "women/68.jpg"
    },
  ];
  res.send(listUser);
});

router.get('/createUser', function (req, res) {
  MongoClient.connect(url, function (err, client) {
      if (err) {
          return res.send({ error: "mongoError", message: err });
      }

      var db = client.db(dbName);
      var userCollection = db.collection('user');
      userCollection.insertMany(listUser).then(function (result) {
          res.send("success");
      }).catch(function (err) {
        res.send("fail!");
      });
  });
});

router.get('/getUser', function (req, res) {

  MongoClient.connect(url, function (err, client) {
    if (err) {
      return res.send({ error: "mongoError", message: err });
    }
    var db = client.db(dbName);
    var userList = db.collection('user');
    //cach viet kieu moi theo promise
    userList.find({}).toArray().then(function (result) {
      res.render('users', { 'data': result });
    }).catch(function (err) {
      res.render('users', { error: 400, message: err });
    });

    //cach viet nodejs thuan
    // userList.find({}).toArray(function (err, result) {
    //     if (err)
    //         res.send({ error: 400, message: err });
    //     else res.send(result);
    // });

  });

})


router.post('/deleteUser', function (req, res) {
  MongoClient.connect(url, function (err, client) {
    if (err) {
      return res.send({ error: "mongoError", message: err });
    }

    var db = client.db(dbName);
    var userList = db.collection('user');

    var id = req.body.id; //id này là giá trị name của input


    userList.deleteOne({ 'id': id }).then(function (result) {
      res.redirect('/users/getUser');
    }).catch(function (err) {
      res.send({ error: 400, message: err });
    });
  });
});

router.post('/login', function (req, res) {
  MongoClient.connect(url, function (err, client) {
    if (err) {
      return res.send({ error: "mongoError", message: err });
    }

    var db = client.db(dbName);
    var userList = db.collection('user');
    var login = {
      username: req.body.username,
      password: req.body.password
    }
    userList.findOne(login).then(function (result) {
      if (result != '') {
        var token = jwt.sign(result, 'json-token', { expiresIn: '1h' });
        result.token = token;
        res.send(result);
      }
      else
        res.send('fail');
    }).catch(function (err) {
      res.send({ error: 400, message: err });
    });
  });
});

module.exports = router;
