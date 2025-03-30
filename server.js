import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './models/index.js';
import { Product } from './models/Product.js';
import { DeliveryOption } from './models/DeliveryOption.js';
import { CartItem } from './models/CartItem.js';
import { defaultProducts } from './defaultData/defaultProducts.js';
import { defaultDeliveryOptions } from './defaultData/defaultDeliveryOptions.js';
import { defaultCart } from './defaultData/defaultCart.js';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve images from the images folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// API route for products
app.get('/products', async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

// API route for delivery options
app.get('/delivery-options', async (req, res) => {
  const deliveryOptions = await DeliveryOption.findAll();
  res.json(deliveryOptions);
});

// API route for cart items
app.get('/cart-items', async (req, res) => {
  const expand = req.query.expand;
  let cartItems = await CartItem.findAll();

  if (expand === 'product') {
    cartItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findByPk(item.productId);
        return {
          ...item.toJSON(),
          product,
        };
      })
    );
  }

  res.json(cartItems);
});

// API route to add a product to the cart
app.post('/cart-items', async (req, res) => {
  const { productId, quantity } = req.body;

  // Check if productId exists in the database
  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(400).json({ error: 'Product not found' });
  }

  // Check if quantity is a number between 1 and 10
  if (typeof quantity !== 'number' || quantity < 1 || quantity > 10) {
    return res
      .status(400)
      .json({ error: 'Quantity must be a number between 1 and 10' });
  }

  // Check if the product already exists in the cart
  let cartItem = await CartItem.findOne({ where: { productId } });
  if (cartItem) {
    // Increase the quantity
    cartItem.quantity += quantity;
    await cartItem.save();
  } else {
    // Add the product to the cart with default deliveryOptionId of "1"
    cartItem = await CartItem.create({
      productId,
      quantity,
      deliveryOptionId: '1',
    });
  }

  res.status(201).json(cartItem);
});

// Error handling middleware
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
/* eslint-enable no-unused-vars */

// Sync database and load default products, delivery options, and cart items if none exist
await sequelize.sync();
const productCount = await Product.count();
if (productCount === 0) {
  await Product.bulkCreate(defaultProducts);
}
const deliveryOptionCount = await DeliveryOption.count();
if (deliveryOptionCount === 0) {
  await DeliveryOption.bulkCreate(defaultDeliveryOptions);
}
const cartItemCount = await CartItem.count();
if (cartItemCount === 0) {
  await CartItem.bulkCreate(defaultCart);
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
