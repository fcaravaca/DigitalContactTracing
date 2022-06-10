var express = require('express');
var router = express.Router();
var keyRequest = require('../keyRequest')
var db = require('../connectorDB')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'ITP Authority' });
});

router.post('/keysRequest', function(req, res, next) {

  if(req.body.auth !== "key_itpa"){ // A proper check is needed
    res.status(401)
    res.send("Unauthrorized")
  }else if(req.body.transaction_ID === null){
    res.status(400)
    res.send("Bad Request")
  }else{

    const HA_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    db.saveTransaction(req.body.transaction_ID, HA_ip,  req.body.LP_url, req.body.total_groups, req.body.infected_groups.length).then(()=>{



    keyRequest.requestKeys(req.body.transaction_ID, req.body.LP_url, true).then(result =>{
      let reason = ""
      if(result.keys.length !== req.body.total_groups){ //Bad request
        reason = "Bad request: wrong num of groups"
        res.status(400)
        res.send({
          "transaction_ID": req.body.transaction_ID,
          "status": reason
        })
        db.saveTransactionResult(req.body.transaction_ID, HA_ip,  req.body.LP_url, reason)
        return;
      }

      const keys_to_send = []

      result.keys.forEach(group => {
        if(req.body.infected_groups.includes(group.group_id)){
          keys_to_send.push(group)
        }
      })

      if(keys_to_send.length !== req.body.infected_groups.length){ // Bad request: groups not included
        reason = "Bad request: group not found"
        res.status(400)
        res.send({
          "transaction_ID": req.body.transaction_ID,
          "status": reason
        })
        db.saveTransactionResult(req.body.transaction_ID, HA_ip,  req.body.LP_url, reason)
        return;
      }
      
      res.send({ // everything went OK
        "transaction_ID": req.body.transaction_ID,
        "keys": keys_to_send
      });
      db.saveTransactionResult(req.body.transaction_ID, HA_ip,  req.body.LP_url, "Transaction OK")

    }).catch(err => {

      res.send({
        "transaction_ID": req.body.transaction_ID,
        "status": "error"
      })
      db.saveTransactionResult(req.body.transaction_ID, HA_ip,  req.body.LP_url, err.toString().substring(0,255))
    })
  }).catch(err => {
    console.log(err)
    res.send({
      "transaction_ID": req.body.transaction_ID,
      "status": "error"
    })
  })
  }
});


module.exports = router;
