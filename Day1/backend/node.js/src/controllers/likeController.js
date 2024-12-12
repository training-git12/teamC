//=============================================================================
// controllers/adminController.js
//
// 役割：管理者およびユーザー操作に関連する機能を提供するコントローラー。
// - 商品に「いいね」を追加する処理
// - 特定ユーザーの「いいね」された商品一覧を取得する処理
//
// 目的
// -「いいね」機能の実装
//   ユーザーが商品に対して「いいね」アクションを実行した際に、そのアクションを
//   データベースに保存し、商品データやユーザーデータを更新します
// -「いいね済み商品リスト」の取得
//   指定されたユーザーが過去に「いいね」した商品の一覧を取得し、UIに反映するために使用します
// - データの一貫性を保つ
//   商品の「いいね」数や、ユーザーが「いいね」した商品のリストを正確に更新・管理します
//=============================================================================

const Product = require('../models/product');
const User = require('../models/user');
const Like = require('../models/like');

// 商品にいいねを追加する処理
exports.likeProduct = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        
        console.log("Like request received:", { userId, productId }); // デバッグ用

        // Likeドキュメントを新規作成
        const newLike = new Like({ userId, productId });
        await newLike.save();

        // Productのlikesをインクリメント
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $inc: { likes: 1 } },
            { new: true }
        );

        if (!updatedProduct) {
            console.log("Product not found:", productId); // デバッグ用
            return res.status(404).json({ message: 'Product not found' });
        }

        // UserのlikedProductsに商品IDを追加
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { likedProducts: productId } }, // 重複を防ぐために$addToSetを使用
            { new: true }
        );
        
        if (!updatedUser) {
            console.log("User not found:", userId); // デバッグ用
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`Product ID: ${productId}, New Likes Count: ${updatedProduct.likes}`);
        res.json({ likes: updatedProduct.likes });
    } catch (error) {
        console.error("Error in likeProduct:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 特定ユーザーの「いいね」された商品IDを取得する処理
exports.getLikedProducts = async (req, res) => {
    console.log("GET request received for liked-products with userId:", req.params.userId);
    try {
        const { userId } = req.params;
        const userRecord = await User.findById(userId);

        if (!userRecord) {
            console.log("User not found:", userId);
            return res.status(404).json({ message: 'User not found' });
        }
        
        console.log("Liked products retrieved:", userRecord.likedProducts);
        res.json(userRecord.likedProducts);
    } catch (error) {
        console.error("Error fetching liked products for user:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
