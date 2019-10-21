const express = require('express')
const app = express();
const cors = require('cors');
const path = require("path");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname + "/../public/")));

const PORT = 3001;

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/../public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
})