var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
/* GET users listing. */



router.use(function (req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, 'json-token', function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        console.log(decoded);
        req.user = decoded;
        console.log('true');
       next(); //chay tiep theo
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});

router.post('/', function(req, res, next) {
  res.send('respond class router');
});

module.exports = router;
