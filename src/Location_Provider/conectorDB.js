const mysql = require('mysql2')

var connection = mysql.createPool({
    connectionLimit : 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
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
    return new Promise(function(resolve, reject){
        connection.query('SELECT group_id, aes_key, iv FROM KeyRegister WHERE transaction_ID = ?',[transaction_ID],  function (error, results, fields) {
            if (error){
                reject(error)
            } else{
                resolve(JSON.parse(JSON.stringify(results)))
            }
        });
    })
}

module.exports = {
    saveKeys,
    getKeys
}