const express = require('express');
const bestSellingController = require('../controllers/bestSelling');
const router = express.Router();



router.post('/bestSellings', bestSellingController.createBestSellingProduct);
router.get('/bestSellings', bestSellingController.getBestSellingProducts);
router.get('/bestSellings/:bestSellingId', bestSellingController.getSingleBestSelling);
router.put('/bestSellings/:bestSellingId', bestSellingController.editBestSelling);
router.delete('/bestSellings/:bestSellingId', bestSellingController.deleteBestSelling);



module.exports = router;