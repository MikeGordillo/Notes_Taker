const fs = require('fs');
const data = require('../db/db.json')
module.exports = function (app) {
    let postNote = data.length;
    app.get('/api/notes', function (req, res) {
        res.json(data)
    });
    // function adds and saves notes to server and logs 'note succesfull'
    app.post('/api/notes', function (req, res) {
        let savedNote = req.body;
        let id = '' + postNote;
        savedNote.id = id;
        postNote = postNote + 1;
        data.push(savedNote);
        fs.writeFile('../db/db.json', JSON.stringify(data), () => {
            console.log('Successful!!')
        });
        res.json(savedNote);
    });
    // function to delete notes
    app.delete('/api/notes/:id', function (req, res) {
        let selected = req.params.id;
        for (let index = 0; index < data.length; index++) {
            if (selected === data[index].id) {
                data.splice(index, 1);
                fs.writeFile('../db/db.json', JSON.stringify(data), () => {
                    console.log('Trashed!')
                });
            };
        };
        res.json(data)
    })
}