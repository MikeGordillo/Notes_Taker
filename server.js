const express = require("express");
const path = require("path");
const fs = require("fs")

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 8000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// HTML Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));

});

app.post("/api/notes", function (req, res) {
    fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, notes) {
        if (error) {
            return console.log(error)
        }
        notes = JSON.parse(notes)

        const id = notes[notes.length - 1].id + 1
        const newNote = { title: req.body.title, text: req.body.text, id: id }
        const activeNote = notes.concat(newNote)

        fs.writeFile(__dirname + "/db/db.json", JSON.stringify(activeNote), function (error, data) {
            if (error) {
                return error
            }
            console.log(activeNote)
            res.json(activeNote);
        })
    })
})

// Pull from db.json
app.get("/api/notes", function (req, res) {
    fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, data) {
        if (error) {
            return console.log(error)
        }
        console.log("Aqui presta atencion", data)
        res.json(JSON.parse(data))
    })
});

app.delete("/api/notes/:id", function (req, res) {
    let noteId = JSON.parse(req.params.id)
    console.log(noteId)
    fs.readFile(__dirname + "/db/db.json", 'utf8', function (error, notes) {
        if (error) {
            return console.log(error)
        }
        notes = JSON.parse(notes)

        notes = notes.filter(val => val.id !== noteId)

        fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), function (error, data) {
            if (error) {
                return error
            }
            res.json(notes)
        })
    })
})

app.put("/api/notes/:id", function (req, res) {
    let noteId = JSON.parse(req.params.id)
    console.log(noteId)
    fs.readFile(__dirname + "db/db.json", "utf8", function (error, notes) {
        if (error) {
            return console.log(error)
        }
        notes.JSONparse(notes)

        notes = notes.filter(val => val.id !== noteId)

        fs.writeFile(__dirname + "db/db.json", JSON.stringify(notes), function (error, data) {
            if (error) {
                return error
            }
            res.json(notes);
        })
    })
})


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("Escuchando Aqui! " + PORT);
});