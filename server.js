const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(express.static('public'))


let Notes = require('./db/db.json')


function updateNotes() {
    fs.writeFileSync('./db/db.json', JSON.stringify(Notes), function (err) {
        if (err) {
            return err
        }
    })
}

//Creates a random id (of any number or letter).
let noteId = function() {
    return Math.random().toString(36).substr(2, 15)
}


//HTML ROUTE SECTION
//Index (Homepage)
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

//Notes page
app.get('/notes', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
})

//API route that reads the 'db.json' and returns all saved notes as JSON.
app.get('/api/notes', function (req, res) {
    return res.json(Notes)
})

//ADDING NOTES SECTION
app.post('/api/notes', function (req, res) {
    let note = req.body
    note.id = noteId()

    Notes.push(note)

    updateNotes()

    return res.json(Notes)
})

//DELETING NOTES SECTION
app.delete('/api/notes/:id', function (req, res) {
    let id = req.params.id

    for (let i=0; i < Notes.length; i++) {
        if (Notes[i].id === id) {
            Notes.splice(i, 1)
        }
    }
    updateNotes()

    return res.json(Notes)
})

//For the port to listen. Console logs the port number so you know where to go.
app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`))