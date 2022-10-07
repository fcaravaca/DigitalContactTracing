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

  function sendInformation(information, res, error_message=undefined){
    try{
      let response_info = Buffer.from(JSON.stringify(information)).toString("base64")
      const signature_message = signatureUtility.generateSignature(response_info, "ITPA.pem")
      if(error_message !== undefined){
        res.status(400)
      }
      res.send({info: response_info, id: "ITPA", signature: signature_message, error_message})
    }catch(err){
      console.log(err)
    }
  }
  
  let info = req.body.info
  const signature = req.body.signature
  const id = req.body.id

  
  if(!info || !signature || !id){
    res.status(401)
    res.send({message_error: "Unauthrorized"})
    return;
  }
  if(signatureUtility.checkSignature(info, signature, "security/HAs/" + id + "_public.pem")){
    info = JSON.parse(Buffer.from(info, "base64").toString())
    console.log(info)
  if(!info.transaction_ID){
    res.status(400)
    res.send({message_error: "Bad Request"})
  }else{

    db.saveTransaction(info.transaction_ID, id,  info.LP_ID, info.total_groups, info.infected_groups.length).then(()=>{
      keyRequest.requestKeys(info.transaction_ID, info.LP_ID, true).then(result =>{
        let reason = ""
        result = JSON.parse(Buffer.from(result.info, "base64").toString())
        if(result.keys.length !== info.total_groups){ //Bad request
          reason = "Bad request: wrong num of groups"

          information = {
            "transaction_ID": info.transaction_ID,
          }

          sendInformation(information, res, reason)
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

          information = {
            "transaction_ID": info.transaction_ID,
          }
          sendInformation(information, res, reason)
          db.saveTransactionResult(info.transaction_ID, id, info.LP_ID, reason)
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
        }

        sendInformation(information, res, "error")
        db.saveTransactionResult(info.transaction_ID, id,  info.LP_ID, err.toString().substring(0,255))
      })
    }).catch(err => {
      console.log(err)
      information = {
        "transaction_ID": info.transaction_ID,
        "status": "error"
      }
      sendInformation(information, res, "error")
    })
    }
  }
});


module.exports = router;
