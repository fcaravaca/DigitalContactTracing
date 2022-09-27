var CryptoJS = require("crypto-js");
const crypto = require('crypto');
const db = require('./conectorDB.js')
const csv = require('csv-parser');
const fs = require('fs');

// Aggreagated function to get the contact of N groups
async function getContactIds(groups, transaction_ID, health_authority){

    let contact_groups = []

    return new Promise((resolve, reject) => {
        let promises = []

        for(let i = 0; i < groups.length; i++){
            promises.push(getContactsOfGroup(groups[i].ids)) 
        }

        Promise.all(promises).then(results => {
            for(let i = 0; i < groups.length; i ++){
                contact_groups.push(
                    {
                        "group_id": groups[i].group_id,
                        "contact_ids": results[i]
                    }
                )
            }
            encryptGroups(contact_groups, transaction_ID, health_authority).then(r =>{
                resolve(r)
            })
        })
    })
}

function encryptGroups(groups, transaction_ID, health_authority){
    return new Promise((resolve) => {
        const encrypted_groups = []
        const dbPromises = []
        for(let group of groups){

            const key = crypto.randomBytes(32).toString('hex') // 256 bit key
            const iv = crypto.randomBytes(16).toString('hex')

            dbPromises.push(
                db.saveKeys(transaction_ID, health_authority, group.group_id, key, iv)
            )
            var encrypted_ids = CryptoJS.AES.encrypt(JSON.stringify(group.contact_ids), CryptoJS.enc.Hex.parse(key), 
                {mode: CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7,iv: CryptoJS.enc.Hex.parse(iv)}).toString()

            encrypted_groups.push({
                "group_id": group.group_id,
                "contact_ids": encrypted_ids
            })

        }

        Promise.all(dbPromises).then(r => {
            resolve(encrypted_groups)
        })
    })
}


// Get the aggregated ids of a contact group
function getContactsOfGroup(ids){
    return new Promise((resolve, reject) => {
        let contacts = []
        let promises = []

        for(let i = 0; i < ids.length; i++){
            promises.push(getContactsOfId(ids[i])) 
        }
        
        Promise.all(promises).then(results => {
            contacts = results.reduce((accu, next) => accu.concat(next))
            resolve([...new Set(contacts)])
        })
    })
    const non_repeated_contacts = [...new Set(contacts)] // This will remove a repeated ID

    return non_repeated_contacts
}

// Get the contact IDs from an unique ID -- This will be the contact tracing alg.
// Right now it only generates a random amount of phones
function getContactsOfId(id){
    return new Promise((resolve, reject) => {
        let contacts = generateRandomNumbers(Math.floor((Math.random()*3) + 1))
        resolve(contacts);
        return; 
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