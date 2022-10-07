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

  let info = req.body.info
  const signature = req.body.signature
  const id = req.body.id

  if(!info || !signature || !id){
    res.status(401)
    res.send("Unauthrorized")
    return;
  }
  if(signatureUtility.checkSignature(info, signature, "security/HAs/" + id + "_public.pem")){
    info = JSON.parse(Buffer.from(info, "base64").toString())
    const n = parseInt(info.amount)

    if(n < 2 || !info.transaction_ID){
      res.status(400)
      res.send("Bad Request")
    }else{

      ids = mobileIds.getMobileIds(n)

      information = {
        "transaction_ID": info.transaction_ID,
        "amount": n,
        "ids": ids
      };

      let response_info = Buffer.from(JSON.stringify(information)).toString("base64")

      const signature_message = signatureUtility.generateSignature(response_info, "IDP.pem")
      connectorDB.registerRequest(info.transaction_ID, id, n).catch(err => console.log(err))

    res.send({info: response_info, id: "IDP", signature: signature_message})
  }
  }else{
    console.log("Not valid signature")
    res.send({error_message: "Unathorized"})
  }
});



module.exports = router;
