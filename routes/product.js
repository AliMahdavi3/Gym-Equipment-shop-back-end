const express = require('express');
const productController = require('../controllers/product');
const router = express.Router();


router.post('/product', productController.createProduct);
router.get('/products', productController.getProducts);
router.get('/product/:productId', productController.getSingleProduct);


module.exports = router;