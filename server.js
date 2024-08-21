const express = require('express');
const path = require('path');
const { v4:uudv4 } = require('uuid');
const fs = require('fs').promises;


const app = express();
const PORT = process.env.PORT || 3001;


// Midleware to parse JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const notesRead = async (notes) => {
    try {
        await fs.writeFile(path.join(__dirname, 'db', 'db.json'), 'utf8');
        return JSON.parse(data);
    } catch(err) {
        console.error(err)
        return[];
    }
};

app.get('/api/notes', async (req,res) => {
    try {
        const notes = await notesRead();
        res.json(notes);
    }
});

app.post('/api/notes', async (req,res) => {
    try {
        const notes = await notesRead();
        const newNote = {
            id: uuidv4(),
            title: req.body.title,
            text: req.body.text
        };

        notes.push(newNote);
        await writeNotes(notes);
        res.json(newNote);
    }   catch(err) {
        console.error(err);
    }
});
app.get('*', (rerq,res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
      const noteId = req.params.id;
      let notes = await notesRead();
      notes = notes.filter(note => note.id !== noteId);
      await writeNotes(notes);
      res.json({ message: 'Note deleted successfully' });  
    } catch (err) {
        res.status(500).json({ error: 'Error deleting note' });
    }
});

//Start the server
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}');
});