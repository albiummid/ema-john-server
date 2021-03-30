const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gpn2l.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;

const app = express()
// middleware\
app.use(express.json());
app.use(cors());

const port = 5000;
app.get('/', (req, res) => {
  res.send("Hello ! This is Port 5000 and developed for ema john simple server")
})
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  console.log("database Connected , error:", err);

  // for post
  app.post('/addProduct', (req, res) => {
    const products = req.body;
    productsCollection.insertOne(products)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount)
      })

  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  // for get
  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  // for get sigle product by product key
  app.get('/product/:key', (req, res) => {
    productsCollection.find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({ key: { $in: productKeys } })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

});




app.listen(process.env.PORT || port)