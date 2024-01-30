const express = require('express');
const path = require('path');
// const db = require('./db/db.json');
const fs = require('fs/promises');


const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/notes", (req, res) =>{
    
  return res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get('/api/notes', (req, res) =>{
    ReadDatabase().then((data)=>{
        return res.status(200).json(data);
    }).catch(err=>{
        return res.status(422);
    });
});

app.post("/api/notes", (req, res) =>{
    const note = {
        ... req.body
    };
    if(note.title === undefined || note.text === undefined){
        return res.send("Must have Title and body text");
    }
    ReadDatabase().then((db)=>{
        note.id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        db.push(note);
        fs.writeFile("./db/db.json", `${JSON.stringify(db)}`).then(()=>{
            return res.send("Saved: " + JSON.stringify(note));
        }).catch(err=>{
            return res.send(err);
        });
    })
    .catch(err=>{
        return res.status(422);
    })
});

app.delete('/api/notes/:id', (req, res) =>{
    if(req.params.id === undefined){
        return res.send("must have an id.");
    }
    ReadDatabase().then(db=>{
        const newDB = db.filter((item)=> item.id != req.params.id);
        if(newDB.length === db.length)
            return res.send("Note ID not found");

        fs.writeFile("./db/db.json", `${JSON.stringify(newDB)}`).then(()=>{
            return res.send("Success: ");
        }).catch(err=>{
            return res.status(422);
        });
    })
    .catch(err =>{
        return res.status(422);
    });
    
});

app.listen(port, () =>{
  console.log(`server listeing at localhost:${port}`);
});

const ReadDatabase = () => new Promise((resolve, reject)=>{
    fs.readFile("./db/db.json").then((data)=>{
        resolve(JSON.parse(data));
    }).catch(err=>{
        reject(err);
    });
});