const express = require('express')
const { connectToDb, getDb } = require('./database')
const { ObjectId } = require('mongodb')

// init app and middleware
const app = express()
// to pass json request body -> post or put method
app.use(express.json())

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

app.get('/books/:id', (req, res) => {

    // check if id format is valid
    if (ObjectId.isValid(req.params.id)) {
      db.collection('books')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(doc => {
          res.status(200).json(doc)
        })
        .catch(err => {
          res.status(500).json({error: 'Could not fetch the document'})
        })
        
    } else {
      res.status(500).json({error: 'Could not fetch the document'})
    }
  
})


app.post('/books', (req, res) => {

    const book = req.body // json object of values
    db.collection('books')
      .insertOne(book)
      .then(result => {
        res.status(201).json(result)
      })
      .catch(err => {
        res.status(500).json({err: 'Could not create new document'})
      })
})
  

app.delete('/books/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .deleteOne({ _id: new ObjectId(req.params.id) })
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Could not delete document'})
        })
  
    } else {
      res.status(500).json({error: 'Could not delete document'})
    }
})

app.patch('/books/:id', (req, res) => {
    
    const updates = req.body // json object of values
    if (ObjectId.isValid(req.params.id)) {
  
      db.collection('books')
        .updateOne({ _id: new ObjectId(req.params.id) }, {$set: updates})
        .then(result => {
          res.status(200).json(result)
        })
        .catch(err => {
          res.status(500).json({error: 'Could not update document'})
        })
  
    } else {
      res.status(500).json({error: 'Could not update document'})
    }
})
