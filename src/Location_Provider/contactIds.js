var CryptoJS = require("crypto-js");
const crypto = require('crypto');
const db = require('./conectorDB.js')
const csv = require('csv-parser');
const fs = require('fs');

// Aggreagated function to get the contact of N groups
async function getContactIds(groups, transaction_ID, health_authority){

    let contact_groups = []

    for(let i = 0; i < groups.length; i ++){
        let contact_ids = await getContactsOfGroup(groups[i].ids)
        contact_groups.push(
            {
                "group_id": groups[i].group_id,
                "contact_ids": contact_ids
            }
        )
    }
    console.log(groups)
    console.log(contact_groups)

    return await encryptGroups(contact_groups, transaction_ID, health_authority)
}

async function encryptGroups(groups, transaction_ID, health_authority){

    const encrypted_groups = []
    for(let group of groups){

        const key = crypto.randomBytes(32).toString('hex') // 256 bit key
        const iv = crypto.randomBytes(16).toString('hex')

        await db.saveKeys(transaction_ID, health_authority, group.group_id, key, iv)

        var encrypted_ids = CryptoJS.AES.encrypt(JSON.stringify(group.contact_ids), CryptoJS.enc.Hex.parse(key), 
            {mode: CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7,iv: CryptoJS.enc.Hex.parse(iv)}).toString()

        encrypted_groups.push({
            "group_id": group.group_id,
            "contact_ids": encrypted_ids
        })

    }

    return encrypted_groups
}


// Get the aggregated ids of a contact group
async function getContactsOfGroup(ids){

    let contacts = []
    for(let i = 0; i < ids.length; i++){
        contacts = contacts.concat(await getContactsOfId(ids[i]))
    }

    const non_repeated_contacts = [...new Set(contacts)] // This will remove a repeated ID

    return non_repeated_contacts
}

// Get the contact IDs from an unique ID -- This will be the contact tracing alg.
// Right now it only generates a random amount of phones
function getContactsOfId(id){
    return new Promise((resolve, reject) => {
        fs.createReadStream('contacts.csv')
        .pipe(csv({ escape: '\\' }))
        .on('data', (row) => {
            if(row.id.toString() === id.toString()){
                resolve(JSON.parse(row.contacts.split('"')[1].replaceAll("'","")))
                return
            }
        })
        .on('end', () => {
            resolve(null)
        });
    })
    let contacts = generateRandomNumbers(Math.floor((Math.random()*3) + 1))
    return contacts
}

// This is copy-paste to generate random phones, this can be deleated when getContactsOfId get a new 
function generateRandomNumbers(n){

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