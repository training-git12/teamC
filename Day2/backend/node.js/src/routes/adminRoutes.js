const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// 商品に対する「いいね」を削除
router.delete('/likes', adminController.deleteLike);

// すべての「いいね」を削除
router.delete('/likes/all', adminController.deleteAllLikes);

module.exports = router;