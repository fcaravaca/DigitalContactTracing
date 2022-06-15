var express = require('express');
var router = express.Router();
var mobileIds = require('../getMobileIds')

var signatureUtility = require("../signatureUtility")
var connectorDB = require("../connectorDB")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'ID Provider' });
});

router.post('/mobileIDs', function(req, res, next) {

  const info = req.body.info
  const signature = req.body.signature
  const id = req.body.id

  if(!info || !signature || !id){
    res.status(401)
    res.send("Unauthrorized")
    return;
  }

  if(signatureUtility.checkSignature(JSON.stringify(info), signature, id + "_public.pem")){
    const n = parseInt(info.amount)

    if(n < 2 || info.transaction_ID === null){
      res.status(400)
      res.send("Bad Request")
    }else{

      ids = mobileIds.getMobileIds(n)

      information = {
        "transaction_ID": info.transaction_ID,
        "amount": n,
        "ids": ids
      };

      information = JSON.stringify(information)

      const signature_message = signatureUtility.generateSignature(information, "IDP.pem")
      connectorDB.registerRequest(info.transaction_ID, id, n).catch(err => console.log(err))

    res.send({info: information, id: "IDP", signature: signature_message})
  }
  }else{
    console.log("Not valid signature")
    res.send("error")
  }
});



module.exports = router;
