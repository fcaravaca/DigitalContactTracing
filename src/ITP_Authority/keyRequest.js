const  got = require('got');
const { HttpProxyAgent } = require('hpagent')

var signatureUtility = require("../signatureUtility")



async function requestKeys(transaction_ID, url, useProxy){

    let information = {id: "ITPA", "transaction_ID": transaction_ID}

    information_str = JSON.stringify(information)
    const signature_message = signatureUtility.generateSignature(information_str, "ITPA.pem")
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

    const response = await got.post(url + '/keysRequest', information).json().catch(err => console.log(err));
    const isValidSignature = signatureUtility.checkSignature(JSON.stringify(response.info), response.signature, response.id + "_public.pem")
    console.log("valid signature:", isValidSignature)
    return response;
}

module.exports = {requestKeys}
