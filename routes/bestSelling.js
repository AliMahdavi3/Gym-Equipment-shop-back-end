const express = require('express');
const bestSellingController = require('../controllers/bestSelling');
const router = express.Router();



router.post('/bestSelling', bestSellingController.createBestSellingProduct);
router.get('/bestSellings', bestSellingController.getBestSellingProducts);
router.get('/bestSellings/:bestSellingId', bestSellingController.getSingleBestSelling);



module.exports = router;