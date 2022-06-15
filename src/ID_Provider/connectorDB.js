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
  
function registerRequest(transaction_ID, health_authority, phones_requested){
    return new Promise(function(resolve, reject){
        connection.query('INSERT INTO Requests VALUES (?,?,?,NOW())',[transaction_ID, health_authority, phones_requested],  function (error, results, fields) {
            if (error){
                reject(error)
            } else{
                resolve('ok')
            }
        });
    })
}

module.exports = {
    registerRequest
}