const express = require('express');
const fs = require('fs');
const { parse } = require('querystring');
const uuidv1 = require('uuidv1');
const app = express();

// require
// get notes from the json using epress api
// apend new notes to the json using Post express api
// delete current notes using api
//use the public folder as the main folder
app.use(express.static('public'))




// this will take the notes from the json file

app.get('/api/notes', (req, res, next) => {
    try {
        fs.readFile(__dirname + '/db/db.json', 'utf-8', (err, data) => {
            if (err) {
                throw Error(err);
            }

            const jsonData = JSON.parse(data);
            res.status(200).send(jsonData);
        })
    } catch (err) {
        console.error(err);
        res.status(404).send();
    }
});

// saving the notes and append to json
app.post('/api/notes', (req, res, next) => {
    //covert body to string
    let body = '';
    req.on('data', data => {
        body += data.toString();
    }).on('end', () => {
        const newNote = parse(body);

        if (Object.keys(newNote).length !== 0) {
            fs.readFile(__dirname + '/db/db.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }
                //parse the body and put it to json with an id
                data = JSON.parse(data);

                newNote.id = data.length;
                data.push(newNote);

                fs.writeFile(__dirname + '/db/db.json', JSON.stringify(data), err => {
                    if (err) throw err;
                    console.log('Added new note.')
                });
            });
            res.send(newNote);
        } else {
            throw new Error('Error');
        }
    });
})






  //delete the selected notes and update info to json
app.delete('/api/notes/:id', (req, res, next) => {
    // Get the id of the note being deleted
    const id = req.params.id;
    fs.readFile(__dirname + '/db/db.json', 'utf-8', (err, notes) => {
        if (err) {
            throw err;
        }

        notes = JSON.parse(notes);
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === parseInt(id)) {
                notes.splice(i, 1);
            }
        }
        // Rewrite the updated notes array
        fs.writeFile(__dirname + '/db/db.json', JSON.stringify(notes), err => {
            if (err) throw err;

            console.log('Updated.')
        });
    });

    res.send('Deleted.');
})


//get res index.html, notes.html
app.get('/', (req, res, next) => {
    res.status(200).sendFile(__dirname + '/public/index.html');
});

app.get('/notes', (req, res, next) => {
    res.status(200).sendFile(__dirname + '/public/notes.html');
});
//add listener
const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log(`localhost:${PORT}`)