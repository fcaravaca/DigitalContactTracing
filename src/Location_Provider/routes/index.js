var express = require('express');
var router = express.Router();
var contactIds = require('../contactIds')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'Location Provider' });
});

router.post('/contactTracingRequest', function(req, res, next) {

  if(req.body.auth !== "location_key"){ // A proper check is needed
    res.status(401)
    res.send("Unauthrorized")
  }else if(req.body.transaction_ID === null){
    res.status(400)
    res.send("Bad Request")
  }else{

    res.send({
      "transaction_ID": req.body.transaction_ID,
      "groups": contactIds.getContactIds(req.body.groups)
    });
  }

});

module.exports = router;
