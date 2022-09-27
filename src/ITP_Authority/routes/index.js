var express = require('express');
var router = express.Router();
var keyRequest = require('../keyRequest')
var db = require('../connectorDB')

var signatureUtility = require("../signatureUtility")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'ITP Authority' });
});



router.post('/keysRequest', function(req, res, next) {

  function sendInformation(information, res){
    try{
      const signature_message = signatureUtility.generateSignature(JSON.stringify(information), "ITPA.pem")
      res.send({info: information, id: "ITPA", signature: signature_message})
    }catch(err){
      console.log(err)
    }
  }
  
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

    db.saveTransaction(info.transaction_ID, id,  info.LP_ID, info.total_groups, info.infected_groups.length).then(()=>{
      keyRequest.requestKeys(info.transaction_ID, info.LP_ID, true).then(result =>{
        let reason = ""
        result = result.info
        if(result.keys.length !== info.total_groups){ //Bad request
          reason = "Bad request: wrong num of groups"
          res.status(400)
          information = {
            "transaction_ID": info.transaction_ID,
            "status": reason
          }

          sendInformation(information, res)
          db.saveTransactionResult(info.transaction_ID, id,  info.LP_ID, reason)
          return;
        }

        const keys_to_send = []

        result.keys.forEach(group => {
          if(info.infected_groups.includes(group.group_id)){
            keys_to_send.push(group)
          }
        })

        if(keys_to_send.length !== info.infected_groups.length){ // Bad request: groups not included
          reason = "Bad request: group not found"
          res.status(400)
          information = {
            "transaction_ID": info.transaction_ID,
            "status": reason
          }
          sendInformation(information, res)
          db.saveTransactionResult(info.transaction_ID, id,  info.LP_ID, reason)
          return;
        }
        
        information = { // everything went OK
          "transaction_ID": info.transaction_ID,
          "keys": keys_to_send
        };
        db.saveTransactionResult(info.transaction_ID, id,  info.LP_ID, "Transaction OK").catch(err => console.log(err))
        sendInformation(information, res)

      }).catch(err => {
        console.log(err)
        information = {
          "transaction_ID": info.transaction_ID,
          "status": "error"
        }
        sendInformation(information, res)
        db.saveTransactionResult(info.transaction_ID, id,  info.LP_ID, err.toString().substring(0,255))
      })
    }).catch(err => {
      console.log(err)
      information = {
        "transaction_ID": info.transaction_ID,
        "status": "error"
      }
      sendInformation(information, res)
    })
    }
  }
});


module.exports = router;
