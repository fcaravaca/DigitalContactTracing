var express = require('express');
var router = express.Router();
var contactIds = require('../contactIds')
var db = require('../conectorDB')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'Location Provider' });
});

router.post('/contactTracingRequest', async function(req, res, next) {
  if(req.body.auth !== "location_key"){ // A proper check is needed
    res.status(401)
    res.send("Unauthrorized")
  }else if(req.body.transaction_ID === null){
    res.status(400)
    res.send("Bad Request")
  }else{
    const groupIds =  await contactIds.getContactIds(req.body.groups, req.body.transaction_ID)
    res.send({
      "transaction_ID": req.body.transaction_ID,
      "groups":groupIds
    });
  }
});

router.post('/keysRequest', function(req, res, next) {
  if(req.body.auth !== "location_key_itpa"){ // A proper check is needed
    res.status(401)
    res.send("Unauthrorized")
  }else if(req.body.transaction_ID === null){
    res.status(400)
    res.send("Bad Request")
  }else{
    db.getKeys(req.body.transaction_ID).then(result => {
      res.send({"transaction_ID": req.body.transaction_ID, "keys": result})
    }).catch(err => res.send({"transaction_ID": transaction_ID, "status": "error"}))
    
  }
});


module.exports = router;
