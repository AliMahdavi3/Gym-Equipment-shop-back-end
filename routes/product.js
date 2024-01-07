const express = require('express');
const productController = require('../controllers/product');
const router = express.Router();


router.post('/product', productController.createProduct);
router.get('/products', productController.getProducts);
router.get('/product/:productId', productController.getSingleProduct);
router.put('/product/:productId', productController.editProduct);
router.delete('/product/:productId', productController.deleteProduct);


module.exports = router;