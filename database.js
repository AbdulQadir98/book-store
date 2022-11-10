// database connection file
// there's 2 main functions to,
// initially connect to the database - connectToDb()
// retrieve database connection once connected - getDb()

const { MongoClient } =  require('mongodb')

let dbConnection;

module.exports = {
    connectToDb : (callback) => {
        MongoClient.connect('mongodb://localhost:27017/bookstore')
            .then((client) => {
                dbConnection = client.db()
                return callback()
            })
            .catch(err => {
                console.log(err)
                return callback(err)
            })
    },
    getDb : () => dbConnection
}