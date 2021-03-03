const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

// activeNote is used to keep track of the note in the textarea
const activeNote = {};

// A function for getting all notes from the db
const getNotes = function () {
    return $.ajax({
        url: "api/notes",
        method: "GET"
    });
};

// A function for saving a note to the db
const saveNote = function (note) {
    return $.ajax({
        url: "api/notes",
        data: note,
        method: "POST"
    });
};

// A function for deleting a note from the db
const deleteNote = function (id) {
    return $.ajax({
        url: "api/notes/" + id,
        method: "DELETE"
    });
};

const editNote = function (id) {
    return $.ajax({
        url: "api/notes/" + id,
        method: "PUT"
    })
};

// If there is an activeNote, display it, otherwise render empty inputs
const renderActiveNote = function () {
    console.log("got here active note")
    // $saveNoteBtn.hide();

    if (activeNote.id) {
        $noteTitle.attr("readonly", true);
        $noteText.attr("readonly", true);
        $noteTitle.val(activeNote.title);
        $noteText.val(activeNote.text);
    } else {
        $noteTitle.attr("readonly", false);
        $noteText.attr("readonly", false);
        $noteTitle.val("");
        $noteText.val("");
    }
};

// Get the note data from the inputs, save it to the db and update the view
const handleNoteSave = function () {
    const newNote = {
        title: $noteTitle.val(),
        text: $noteText.val()
    };

    saveNote(newNote).then(function (data) {
        getAndRenderNotes();
        renderActiveNote();
    });
};

const handleEdit = function (event) {
    event.stopPropagation();
    handleNoteView();
    console.log("got here")
    const note = $(this)
        .parent(".list-group-item")
        .data();

    if (activeNote.id === note.id) {
        activeNote = {
            title: $noteTitle.val(),
            text: $noteText.val()
        };
    }
    editNote(note.id).then(function () {
        saveNote(activeNote);
        getAndRenderNotes();
        renderActiveNote();
    })
    console.log(note)
}

// Delete the clicked note
const handleNoteDelete = function (event) {
    // prevents the click listener for the list from being called when the button inside
    event.stopPropagation();

    const note = $(this)
        .parent(".list-group-item")
        .data();

    if (activeNote.id === note.id) {
        activeNote = {};
    }

    deleteNote(note.id).then(function () {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// Sets the activeNote and displays it
const handleNoteView = function () {
    console.log("ahora se ve!")
    activeNote = $(this).data();
    renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = function () {
    activeNote = {};
    renderActiveNote();
};

// If a note's title or text are empty, hide the save button
// Or else show it
const handleRenderSaveBtn = function () {
    if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
        $saveNoteBtn.hide();
    } else {
        $saveNoteBtn.show();
    }
};

// Render's the list of note titles
const renderNoteList = function (notes) {
    $noteList.empty();

    const noteListItems = [];

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];

        const $li = $("<li class='list-group-item'>").data(note);
        const $span = $("<span>").text(note.title);
        const $delBtn = $(
            "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
        );
        const $editBtn = $(
            "<i class='penStyle fas fa-pen text-light edit-note float-right'>"
        );

        $li.append($span, $delBtn, $editBtn);
        noteListItems.push($li);
    }

    $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = function () {
    return getNotes().then(function (data) {
        renderNoteList(data);
    });
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".edit-note", handleEdit);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();