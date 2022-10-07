const  got = require('got');
const { HttpProxyAgent, HttpsProxyAgent } = require('hpagent')

var signatureUtility = require("../signatureUtility")
var useHttps = process.env.HTTPS === "" || process.env.HTTPS === "true"
const urls = JSON.parse(process.env.LP_URLS.replaceAll("'",'"'))

async function requestKeys(transaction_ID, LP_ID, useProxy){

    let information_value = {id: "ITPA", "transaction_ID": transaction_ID}
    information_value = Buffer.from(JSON.stringify(information_value)).toString("base64")
    const signature_message = signatureUtility.generateSignature(information_value, "ITPA.pem")
    information = {json : {info: information_value,  signature: signature_message, id: "ITPA"}}

    if(useProxy){
        if(useHttps){
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; // This will avoid verifying the SSL ceritificate
            information["agent"] = {
                https: new HttpsProxyAgent({
                    keepAlive: true, keepAliveMsecs: 1000, maxSockets: 256, maxFreeSockets: 256, scheduling: 'lifo', proxy: 'http://host.docker.internal:8888'
                })
            }
        }else{
            information["agent"] = {
                http: new HttpProxyAgent({
                    keepAlive: true, keepAliveMsecs: 1000, maxSockets: 256, maxFreeSockets: 256, scheduling: 'lifo', proxy: 'http://host.docker.internal:8888'
                })
            }
        }

    }

    const url_request = (useHttps ? "https://" : "http://") + urls[LP_ID] + '/keysRequest'

    const response = await got.post(url_request , information).json().catch(err => console.log(err));
    const isValidSignature = signatureUtility.checkSignature(response.info, response.signature, "security/LPs/" + LP_ID + "_public.pem")
    if(isValidSignature){
        return response;
    }else{
        return {info: {keys: []}}
    }
}

module.exports = {requestKeys}
