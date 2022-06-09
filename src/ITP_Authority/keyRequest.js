const  got = require('got');
const { HttpProxyAgent } = require('hpagent')

async function requestKeys(transaction_ID, url, useProxy){

    const request_info = {
        json: {"transaction_ID": transaction_ID, "auth": "location_key_itpa"},

    }

    if(useProxy){
        request_info["agent"] = {
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

    const response = await got.post(url + '/keysRequest', request_info).json().catch(err => console.log(err));

    return response;
}

module.exports = {requestKeys}
