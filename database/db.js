const jewelry = require('./jewelry.js');
const housewares = require('./housewares.js');
const accessories = require('./accessories.js');
const toys = require('./toys.js');

const mongoose = require('mongoose');
const host = 'mongo'
// const host = 'localhost'
mongoose.connect(`mongodb://${host}:27017/products`, {useNewUrlParser: true, useUnifiedTopology: true})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(`we're connected!`)

})
const imagesSchema = new mongoose.Schema({
  listing_image_id: Number,
  listing_id: Number,
  url_75x75: String,
  url_170x135: String,
  url_570xN: String,
  url_fullxfull: String,
  full_height: Number,
  full_width: Number,
})

const optionsSchema = new mongoose.Schema({
  title: String,
  description_1: String,
  description_2: String,
  description_3: String,
  description_4: String,
})

const productSchema = new mongoose.Schema({
  listing_id: { // <-- product id
    type: Number,
    unique: true,
  },
  title: String,
  description: String,
  price: Number,
  category_path: [String],
  Images: [imagesSchema],
  Shop: {
    shop_id: Number,
    shop_name: String,
    title: String,
    icon_url_fullxfull: String,
    custom_shops_state: Number,
  },
  product_options: [optionsSchema],
});

const Products = mongoose.model('Products', productSchema);

const productsSave = products => {
  Products.insertMany(products)
    .then((data) => {
      console.log('...Saved products to database...')
      return data
    })
    .catch((err) => {
      console.log('...product saving err... ');
    })
}

const findCombinedProductsforID = async (id) => {
  const product = await findProduct(id)
  category = product.category_path
  const relatedProducts = await findRelatedProducts(category);
  const addlShopProducts = await findShopProducts()
  return [product, addlShopProducts, relatedProducts]
}

const findProduct = async (id) => {
  const product = await Products.findOne(id)
    .catch(error => {
      return ("error of ", error)
    })
  return product
}

const findAllProducts = async () => {
  const products = await Products.find()
    .catch(error => {
      return ("error of ", error)
    })
  return products
}

const findRelatedProducts = async () => {
  const returnQty = Math.round(Math.random()) === 0 ? 5 : 10;
  const products = await Products.find({category_path : category[0]}).limit(returnQty)
    .catch(error => {
      return ("error of ", error)
    })
  return products
}

const findShopProducts = async () => {
  const returnQty = 5;
  const products = await Products.aggregate().sample(returnQty)
  .catch(error => {
    return ("error of ", error)
  })
  return products
}

let initialized = false;

const initializeProducts = () => {
  productsSave(jewelry.results);
  productsSave(housewares.results);
  productsSave(accessories.results);
  productsSave(toys.results);
  initialized = true
  return initialized;
}

if (!initialized) {
  initializeProducts();
}


module.exports = {
  findProduct,
  findAllProducts,
  findRelatedProducts,
  findShopProducts,
  findCombinedProductsforID
}