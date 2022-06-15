const  got = require('got');
const { HttpProxyAgent } = require('hpagent')

var signatureUtility = require("../signatureUtility")

const urls = {
    "LP1": "http://locationprovider1.com",
    "LP2": "http://locationprovider2.com",
    "LP3": "http://locationprovider3.com",
}

async function requestKeys(transaction_ID, LP_ID, useProxy){

    let information = {id: "ITPA", "transaction_ID": transaction_ID}

    const signature_message = signatureUtility.generateSignature(JSON.stringify(information), "ITPA.pem")
    information = {json : {info: information,  signature: signature_message, id: "ITPA"}}

    if(useProxy){
        information["agent"] = {
            http: new HttpProxyAgent({
                keepAlive: true,
                keepAliveMsecs: 1000,
                maxSockets: 256,
                maxFreeSockets: 256,
                scheduling: 'lifo',
                proxy: 'http://host.docker.internal:8888'
            })
        }
    }

    const response = await got.post(urls[LP_ID] + '/keysRequest', information).json().catch(err => console.log(err));
    const isValidSignature = signatureUtility.checkSignature(JSON.stringify(response.info), response.signature, response.id + "_public.pem")
    if(isValidSignature){
        return response;
    }else{
        return {info: {keys: []}}
    }
}

module.exports = {requestKeys}
