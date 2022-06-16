const  got = require('got');
const { HttpsProxyAgent } = require('hpagent')

var signatureUtility = require("../signatureUtility")

const urls = {
    "LP1": "https://locationprovider1.com",
    "LP2": "https://locationprovider2.com",
    "LP3": "https://locationprovider3.com",
}

async function requestKeys(transaction_ID, LP_ID, useProxy){

    let information = {id: "ITPA", "transaction_ID": transaction_ID}

    const signature_message = signatureUtility.generateSignature(JSON.stringify(information), "ITPA.pem")
    information = {json : {info: information,  signature: signature_message, id: "ITPA"}}

    if(useProxy){
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; // This will avoid verifying the SSL ceritificate
        information["agent"] = {
            https: new HttpsProxyAgent({
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
