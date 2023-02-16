import express from "express";
import fs from 'fs';

const app = express();
const port = 4002;

// list of data with varying fields
let rawdata = fs.readFileSync('data/person_keypoints_train2017.json');
let results = JSON.parse(rawdata);


app.get("/data", (req, res) => {
  results.images = results.images.slice(0, 10);
    res.send(results);
  });

app.listen(port, () => {
  console.log(`Running a server at http://localhost:${port}`);
});

