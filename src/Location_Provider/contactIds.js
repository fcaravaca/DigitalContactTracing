var CryptoJS = require("crypto-js");
const crypto = require('crypto');
  
// Aggreagated function to get the contact of N groups
function getContactIds(groups){
    let contact_groups = groups.map((group) => {
        return {
            "group_id": group.group_id,
            "contact_ids": getContactsOfGroup(group.ids)
        }

    });

    return encryptGroups(contact_groups)
}

function encryptGroups(groups){
    const encrypted_groups = groups.map((group)=>{
        
        const key = crypto.randomBytes(16).toString('hex') // With the toString generates a 256bit key
        const iv = crypto.randomBytes(8).toString('hex')

        console.log("key:", key,"iv:",iv);

        var encrypted_ids = CryptoJS.AES.encrypt(JSON.stringify(group.contact_ids), CryptoJS.enc.Utf8.parse(key), 
                            {mode: CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7,iv: CryptoJS.enc.Utf8.parse(iv)}).toString()

        return {
            "group_id": group.group_id,
            "contact_ids": encrypted_ids
        }
    });

    return encrypted_groups
}


// Get the aggregated ids of a contact group
function getContactsOfGroup(ids){

    let contacts = []
    ids.forEach(id =>{
        contacts = contacts.concat(getContactsOfId(id))
    });

    const non_repeated_contacts = [...new Set(contacts)] // This will remove a repeated ID

    return non_repeated_contacts
}

// Get the contact IDs from an unique ID -- This will be the contact tracing alg.
// Right now it only generates a random amount of phones
function getContactsOfId(id){
    let contacts = generateRandomNumbers(Math.floor((Math.random()*7) + 1))
    return contacts
}

// This is copy-paste to generate random phones, this can be deleated when getContactsOfId get a new 
function generateRandomNumbers(n){

    //console.log("Generating " + n + " phones")

    const mobileIds = Array.from(Array(n)).map((x, i) => {
        const randomNumber = Math.floor((Math.random() * 100000000) + 1);

        const number = "6" + pad(randomNumber, 8) // Add leading 0s if necessary 
        const final_number = formatNumber(number) // Better formating (not necessary at all)

        return final_number
    });
    
    return mobileIds;
}

function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function formatNumber(num){
    return ["+34",num.slice(0, 3), num.slice(3,6), num.slice(6)].join(' ');
}

module.exports = {
    getContactIds
}