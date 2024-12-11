const express = require('express');
const router = express.Router();


const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);       // `/` のルート

router.get('/:productId', productController.getProductById); // `/:productId` のルート

module.exports = router;