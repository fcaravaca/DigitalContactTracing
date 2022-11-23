const  got = require('got');

var signatureUtility = require("../signatureUtility")
var useHttps = process.env.HTTPS === "" || process.env.HTTPS === "true"
var validateHTTPS = process.env.VALIDATE_HTTPS === "" || process.env.VALIDATE_HTTPS === "true"
const urls = JSON.parse(process.env.LP_URLS.replaceAll("'",'"'))

async function requestKeys(transaction_ID, LP_ID){

    let information_value = {id: "ITPA", "transaction_ID": transaction_ID}
    information_value = Buffer.from(JSON.stringify(information_value)).toString("base64")
    const signature_message = signatureUtility.generateSignature(information_value, "ITPA.pem")
    information = {json : {info: information_value,  signature: signature_message, id: "ITPA"}}

    if(!validateHTTPS){
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    }

    const url_request = (useHttps ? "https://" : "http://") + urls[LP_ID].replace("127.0.0.1", "host.docker.internal") + '/keysRequest'

    const response = await got.post(url_request , information).json().catch(err => console.log(err));
    const isValidSignature = signatureUtility.checkSignature(response.info, response.signature, "security/LPs/" + LP_ID + "_public.pem")
    if(isValidSignature){
        return response;
    }else{
        return {info: {keys: []}}
    }
}

module.exports = {requestKeys}
