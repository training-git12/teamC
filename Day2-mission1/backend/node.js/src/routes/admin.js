//=============================================================================
// routes/admin.js
//
// 役割：管理者が特定の条件に基づいて「いいね」のリセット操作を実行できるAPIルートを提供
// - 特定のユーザーの「いいね」履歴をリセットする
// - 特定の商品に関連する「いいね」情報をリセットする
//
// 目的
// - 管理者が「いいね」データを操作・管理するための機能を提供します
// - ユーザーまたは商品ごとに「いいね」をリセットし、データベース内の整合性を保つ
// - 商品の「いいね」の数やユーザーの「いいね済みリスト」などの関連情報も更新する
//=============================================================================

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product = require('../models/product');
const Like = require('../models/like');

// ユーザーごとのいいねリセット
router.post('/reset-likes-by-user', async (req, res) => {
    const { userId } = req.body;
    try {
        console.log('Starting to reset likes for user:', userId); // デバッグ用

        // 指定ユーザーのいいねを削除
        await Like.deleteMany({ userId });
        console.log('Likes deleted for user:', userId); // デバッグ用

        // 商品のlikesフィールドを再計算
        const products = await Product.find();
        for (let product of products) {
            const likeCount = await Like.countDocuments({ productId: product._id });
            product.likes = likeCount;
            await product.save();
            console.log(`Product ${product._id} like count updated to:`, likeCount); // デバッグ用
        }

        // ユーザーの likedProducts をリセット
        const result = await User.updateOne(
            { _id: userId },
            { $set: { likedProducts: [] } }
        );
        console.log('User likedProducts reset result:', result); // デバッグ用

        res.json({ message: 'ユーザーのいいねがリセットされました' });
    } catch (error) {
        console.error('Error in reset-likes-by-user:', error);
        res.status(500).json({ message: 'エラーが発生しました', error });
    }
});

// 商品ごとのいいねリセット
router.post('/reset-likes-by-product', async (req, res) => {
    const { productId } = req.body;
    try {
        // 指定商品のいいねを削除
        await Like.deleteMany({ productId });
        
        // 商品のlikesフィールドをリセット
        const product = await Product.findById(productId);
        product.likes = 0;
        await product.save();

        // 全てのユーザーから指定商品IDをlikedProductsから削除
        await User.updateMany(
          { likedProducts: productId },
          { $pull: { likedProducts: productId } }
        );

        res.json({ message: '指定商品のいいねがリセットされました' });
    } catch (error) {
        console.error('Error in reset-likes-by-product:', error);
        res.status(500).json({ message: 'エラーが発生しました', error });
    }
});

//router オブジェクトを他のファイルで使用できるようにモジュールとしてエクスポート
module.exports = router;
