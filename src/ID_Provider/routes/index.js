var express = require('express');
var router = express.Router();
var mobileIds = require('../getMobileIds')

var encryptMessages = require("../encryptMessages")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'ID Provider' });
});

router.post('/mobileIDs', function(req, res, next) {

  const encryptedData = req.body.encryptedData
  const signature = req.body.signature
  if(!encryptedData || !signature){
    res.status(401)
    res.send("Unauthrorized")
    return;
  }

  const host = req.body.id

  let decryptedData = encryptMessages.decryptMessage(encryptedData, signature, "IDP.pem", host + "_public.pem")
  decryptedData = JSON.parse(decryptedData)
  const n = parseInt(decryptedData.amount)

  if(n < 2 || decryptedData.transaction_ID === null){
    res.status(400)
    res.send("Bad Request")
  }else{

    ids = mobileIds.getMobileIds(n)

    information = {
      "transaction_ID": req.body.transaction_ID,
      "amount": n,
      "ids": ids
    };

    information = encryptMessages.encryptMessage(JSON.stringify(information), "IDP.pem", "HA_public.pem")

    res.send({...information, id: "IDP"})
  }
});



module.exports = router;
