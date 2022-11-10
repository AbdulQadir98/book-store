const express = require('express')
const { connectToDb, getDb } = require('./database')

// init app and middleware
const app = express()

// db connection
let db
connectToDb((err) => {
    if(!err){
        app.listen(3000, () => {
            console.log('listening on port 3000 ...')
        })
        db = getDb()
    }
})

// routes
app.get('/books', (req, res) => {

    let books = []
    db.collection('books')
        .find() // returns a cursor object of methods forEach, toArray
        .sort({ author: 1 }) // sorts by author field
        .forEach(book => books.push(book)) // this is an async
        .then(() => {
            res.status(200).json(books)
        })
        .catch(() => {
            res.status(500).json({
                error: "Cound't fetch documents"
            })
        })
})