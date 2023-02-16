import express from "express";
import fs from 'fs';

const app = express();
const port = 4001;

// list of data with varying fields
let rawdata = fs.readFileSync('data/json_data.json');
let results = JSON.parse(rawdata);


app.get("/data", (req, res) => {
    res.send(results.slice(0, 10));
  });

app.listen(port, () => {
  console.log(`Running a server at http://localhost:${port}`);
});

