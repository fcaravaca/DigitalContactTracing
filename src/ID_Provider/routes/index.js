var express = require('express');
var router = express.Router();
var mobileIds = require('../getMobileIds')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'ID Provider' });
});

router.post('/mobileIDs', function(req, res, next) {
  
  console.log(req.body)
  const n = parseInt(req.body.amount)


  if(req.body.auth !== "key"){ // A proper check is needed
    res.status(401)
    res.send("Unauthrorized")
  }else if(n < 2 || req.body.transaction_ID === null){
    res.status(400)
    res.send("Bad Request")
  }else{

    ids = mobileIds.getMobileIds(n)

    console.log(ids)

    res.send({
      "transaction_ID": req.body.transaction_ID,
      "amount": n,
      "ids": ids
    });
  }
});



module.exports = router;
