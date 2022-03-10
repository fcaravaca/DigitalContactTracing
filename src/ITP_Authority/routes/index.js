var express = require('express');
var router = express.Router();
var keyRequest = require('../keyRequest')

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

    keyRequest.requestKeys(req.body.transaction_ID).then(result =>{

      if(result.keys.length !== req.body.total_groups){ //Bad request
        res.status(400)
        res.send({
          "transaction_ID": req.body.transaction_ID,
          "status": "Bad request: wrong num of groups"
        })
        return;
      }

      const keys_to_send = []

      result.keys.forEach(group => {
        if(req.body.infected_groups.includes(group.group_id)){
          keys_to_send.push(group)
        }
      })

      if(keys_to_send.length !== req.body.infected_groups.length){ // Bad request: groups not included
        res.status(400)
        res.send({
          "transaction_ID": req.body.transaction_ID,
          "status": "Bad request: group not found"
        })
        return;
      }
      
      res.send({ // everything went OK
        "transaction_ID": req.body.transaction_ID,
        "keys": keys_to_send
      });
      

    }).catch(err =>
      res.send({
        "transaction_ID": req.body.transaction_ID,
        "status": "error"
      })
    )

  }
});


module.exports = router;
