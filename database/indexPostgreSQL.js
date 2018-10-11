const pg = require('pg');
let client = {
  host: 'ec2-18-144-17-138.us-west-1.compute.amazonaws.com',
  post: 5432,
  user: 'power_user',
  password: '$password',
  database: 'hackazon'
};
const connection = new pg.Client(client);

connection.connect((error, results) => {
  if (error) {
    console.log('ERROR failed to connect to DB', error)
  } else {
    console.log('Successfully connected to DB!')
  }
});

let searchQuery = (productID, callback) => {
  connection.query(`SELECT * FROM product_table INNER JOIN protection_table ON product_table.product_id = protection_table.product_id WHERE product_table.product_id = ${productID};`, (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results.rows[0]);
    }
  })
};

let insertQuery = (product, callback) => {
  connection.query(`INSERT INTO product_table (name, image, link, shares, price, is_prime, in_stock, giftwrap_available, quantity_max, seller) VALUES ('${product.name}', '${product.image}', '${product.link}', ${product.shares}, ${product.price}, ${product.is_prime}, ${product.in_stock}, ${product.giftwrap_available}, ${product.quantity_max}, '${product.seller}')`, (error, results) => {
    if (error) {
      console.log(`ERROR insert query`, error);
    } else {
      console.log(`Successfully inserted into DB!`);
    }
  });

  connection.query(`INSERT INTO protection_table (available, protection_name, protection_price, years, provider, rating, description) VALUES (${product.available}, '${product.protection_name}', ${product.protection_price}, ${product.years}, '${product.provider}', ${product.rating}, '${product.description}')`, (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
}

module.exports = {
  searchQuery,
  insertQuery
}
