const express = require('express');
const redis = require("redis");
const cors = require('cors');


const app = express();

const bodyParser = require('body-parser');
const path = require('path');
const controller = require('../database/indexPostgreSQL.js');

// let client = redis.createClient();
//
// client.on('connect', function(error) {
//   if (error) {
//     console.log('ERROR connecting to redis')
//   } else {
//     console.log('Connected to redis...')
//   }
// });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('./client/dist'));

app.get('/checkout/:id', (req, res) => {

  // client.get(req.params.id, (error, results) => {
  //
  //   if (results !== null) {
  //     res.send(JSON.parse(results))
  //   } else {
      controller.searchQuery(req.params.id, (error, results) => {
        if (error) {
          console.error('ERROR searchQuery controller failed')
        } else {

          let result = {
            giftwrap_available: results.giftwrap_available,
            image: results.image,
            in_stock: results.in_stock,
            is_prime: results.is_prime,
            link: results.link,
            name: results.name,
            price: results.price,
            product_id: results.product_id,
            quantity_max: results.quantity_max,
            seller: results.seller,
            shares: results.shares,
            protection_plan: {
              description: results.description,
              exists: results.available,
              name: results.protection_name,
              price: results.protection_price,
              provider: results.provider,
              rating: results.rating,
              years: results.years,
            }
          }
          // client.setex(req.params.id, 1000000, JSON.stringify(result));
          res.send(result);
      //   }
      // })
    }
  })
})

app.get('/loaderio-115320b901e0f9f6617dd8d8b4c03fdc', (req, res) => {
  res.send('loaderio-115320b901e0f9f6617dd8d8b4c03fdc')
})

app.post('/add-product', (req, res) => {
  controller.insertQuery(req.body, (error, results) => {
    if (error) {
      res.send(error);
    } else {
      res.status(201).send('Post successful!')
    }
  })
})

app.listen(3004, () => console.log('Listening on port 3004...'));
