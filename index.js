const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const markov = require("markov");
const fs = require("fs");
const spawn = require("child_process").spawn;

const app = express();
const server = http.Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('index.html'));
});

app.get('/api', (req, res) => {
  // req.query.param;
  if(req.query.type == "sentence"){
    const pythonProcess = spawn('python',["corpus/makeSentence.py"]);
    pythonProcess.stdout.on('data', (data) => {
      res.send(data);
    });
  }
});

app.use(express.static(__dirname));

let port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`server up on port ${port}`);
});
