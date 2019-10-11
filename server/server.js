const express = require('express')
// const db = require("../database/db")
const app = express();
const cors = require('cors');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const port = 3001;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
})

module.exports.port = port;