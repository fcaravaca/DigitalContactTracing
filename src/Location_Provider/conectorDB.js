const mysql = require('mysql')

var connection = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'user',
    password: 'user',
    database: 'LP',
    timezone: 'Z',
    multipleStatements: true
  });
  

function saveKeys(transaction_ID, group_id, key, iv){
    return new Promise(function(resolve, reject){
        connection.query('INSERT INTO KeyRegister VALUES (?,?,?,?,NOW())',[transaction_ID, group_id, key, iv],  function (error, results, fields) {
            if (error){
                reject(error)
            } else{
                resolve('ok')
            }
        });
    })
}


function getKeys(transaction_ID){



}

module.exports = {
    saveKeys,
    getKeys
}