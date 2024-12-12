//=============================================================================
// controllers/adminController.js
//
// 役割：管理者がユーザーや商品の「いいね」状態をリセットする機能を提供するコントローラー
//  管理者が特定のユーザーまたは商品に関連する「いいね」状態をリセットするために使用されます
//
// 目的
// -「いいね」状態の管理:
//   特定のユーザーが「いいね」した商品情報をリセットする機能を提供します
//   特定の商品に付いた「いいね」をリセットし、その商品を「いいね済みリスト」から削除する機能を提供します
// - データの一貫性の確保:
//   商品ごとの「いいね数」を再計算して正しい状態に更新します
//   ユーザーの「いいね済み商品リスト」（likedProducts）を同期して一貫性を保ちます
// - 管理者の利便性向上:
//   管理者が、ユーザーや商品の「いいね」状態を簡単に操作できるようにします
//=============================================================================

const User = require('../models/user');
const Product = require('../models/product');
const Like = require('../models/like');

// ユーザーごとのいいねリセット
exports.resetLikesByUser = async (req, res) => {
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
};

// 商品ごとのいいねリセット
exports.resetLikesByProduct = async (req, res) => {
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
};
