const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const fs = require('fs/promises');


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/notes", (req, res) =>{
  return res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.post("/api/notes", (req, res) =>{
  const note = {
    ... req.body
  };
  if(note.title === undefined || note.text === undefined){
    return res.send("Must have Title and body text");
  }
  console.log(req.body);
  //if check
  note.id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

  db.push(note);
  //save to json file

  
  return res.send("Saved: " + JSON.stringify(req.body));
});
app.get('/api/notes', (req, res) =>{
  return res.json(db);
});
app.delete('/api/notes/:id', (req, res) =>{
  if(req.query.id === undefined){
    return res.send("must have an id.");
  }
  console.log(req.query.id)
  db.filter((item)=> item.id == req.query.id)
});

app.listen(port, () =>{
  console.log(__dirname);
  console.log(path.join(__dirname, "/public/notes.html"));
  console.log(`server listeing at localhost:${port}`);
})