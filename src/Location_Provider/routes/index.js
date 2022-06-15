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
      const signature_message = signatureUtility.generateSignature(JSON.stringify(information), "private.pem")
      res.send({info: information, id: process.env.ID, signature: signature_message})
    }
  }else{
    console.log("Not valid signature")
    res.send("error")
  }
});

router.post('/keysRequest', function(req, res, next) {

  const info = req.body.info
  const signature = req.body.signature
  const id = req.body.id

  console.log(info, signature, id)

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
      db.getKeys(info.transaction_ID).then(result => {
        information = {"transaction_ID": info.transaction_ID, "keys": result}
        const signature_message = signatureUtility.generateSignature(JSON.stringify(information), "private.pem")
        res.send({info: information, id: process.env.ID, signature: signature_message})
      }).catch(err => {
        console.log(err)
        res.send({"transaction_ID": info.transaction_ID, "status": err})
      })
      
    }    
  }else{
    res.status(401)
    res.send("Unauthrorized")
  }
});


module.exports = router;
