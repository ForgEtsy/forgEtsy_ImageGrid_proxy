const express = require('express')
const app = express();
const cors = require('cors');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const db = require("../database/db")

const PORT = 3001;

app.get("/products", (req, res) => {
  db.findAllProducts()
  .then(product => res.send(product))
  .catch((err) => {
    res.status(400).send("couldnt return those records")
  })
})

app.get("/product/:listing_id", (req, res) => {
  const listingID = req.params
  db.findProduct(listingID)
  .then(product => res.send(product))
  .catch((err) => {
    res.status(400).send("couldnt find that record")
  })
})

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
})