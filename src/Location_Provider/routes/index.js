var express = require('express');
var router = express.Router();
var contactIds = require('../contactIds')
var db = require('../conectorDB')

var signatureUtility = require("../signatureUtility")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'Location Provider' });
});

router.post('/contactTracingRequest', async function(req, res, next) {

  const info = req.body.info
  const signature = req.body.signature
  const id = req.body.id

  if(!info || !signature || !id){
    res.status(401)
    res.send("Unauthrorized")
    return;
  }
  if(signatureUtility.checkSignature(JSON.stringify(info), signature, id + "_public.pem")){
    if(info.transaction_ID === null){
      res.status(400)
      res.send("Bad Request")
    }else{
      const groupIds =  await contactIds.getContactIds(info.groups, info.transaction_ID)
      information = {
        "transaction_ID": info.transaction_ID,
        "groups":groupIds
      };

      information = JSON.stringify(information)
      const signature_message = signatureUtility.generateSignature(information, "private.pem")
      res.send({info: information, id: "LP", signature: signature_message})
    }
  }else{
    console.log("Not valid signature")
    res.send("error")
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
