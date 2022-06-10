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
  
function saveTransaction(transaction_ID, health_authority, location_provider, total_groups, number_of_infected_groups){
    return new Promise(function(resolve, reject){
        connection.query('INSERT INTO Transactions VALUES (?,?,?,NOW(),?,?,NULL)',[transaction_ID, health_authority, location_provider, total_groups, number_of_infected_groups],  function (error, results, fields) {
            if (error){
                reject(error)
            } else{
                resolve('ok')
            }
        });
    })
}

function saveTransactionResult(transaction_ID, health_authority, location_provider, result){
    return new Promise(function(resolve, reject){
            connection.query('UPDATE Transactions SET result=? where transaction_id=? and health_authority = ? and location_provider = ?',[result, transaction_ID, health_authority, location_provider],  function (error, results, fields) {
            if (error){
                reject(error)
            } else{
                resolve('ok')
            }
        });
    })
}

module.exports = {
    saveTransaction,
    saveTransactionResult
}