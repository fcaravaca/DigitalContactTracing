const  got = require('got');

async function requestKeys(transaction_ID){

    const response = await got.post('http://localhost:4000/keysRequest', {
        json: {"transaction_ID": transaction_ID, "auth": "location_key_itpa"},
    }).json();

    return response;
}

module.exports = {requestKeys}
