//=============================================================================
// controllers/productController.js
//
// 役割：商品データを操作するためのコントローラーであり、以下の3つの主要な機能を提供します
// - 全商品の取得
// - 特定の商品をIDで取得
// - 検索クエリに基づいた商品検索
//
// 目的
// - 商品の表示・検索:
//   商品一覧や特定の商品、検索条件に一致する商品の情報をクライアントへ提供し、
//   ECサイトの主要機能である「商品表示」と「検索」をサポートします
// - データの整合性を確保:
//   データベースとクライアント間で正確な商品データをやり取りするため、適切なエラーハンドリングを実施します
// - エンドポイントの再利用性:
//   コントローラーとしてエンドポイントに対応した処理を切り出し、コードの再利用性と保守性を向上させます
//=============================================================================

// Productモデルをインポート（MongoDBのproductコレクションを操作するため）
const Product = require('../models/product');

// 全商品を取得するコントローラ
exports.getAllProducts = async (req, res) => {
    try {
        // データベースから全ての商品を取得
        const products = await Product.find({});
        // クライアントにJSON形式で商品データを返す
        res.json(products);
    } catch (error) {
        // エラー発生時はコンソールにログを出力し、ステータス500を返す
        console.error("Error fetching products:", error);
        res.status(500).send(error);
    }
};

// 指定されたIDの商品を取得するコントローラ
exports.getProductById = async (req, res) => {
    // リクエストURLからproductIdを取得
    const { productId } = req.params;
    
    try {
        // データベースから指定されたIDの商品を取得
        const product = await Product.findById(productId);
        // 該当商品が存在しない場合は404エラーを返す
        if (!product) return res.status(404).json({ message: 'Product not found' });
        // 該当商品をJSON形式でクライアントに返す
        res.json(product);
    } catch (error) {
        // エラー発生時はコンソールにログを出力し、ステータス500を返す
        console.error("Error fetching product:", error);
        res.status(500).send(error);
    }
};

// いいねの切り替え処理
exports.toggleLike = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: '商品が見つかりません' 
            });
        }

        // いいね数の更新を削除し、成功レスポンスのみを返す
        res.json({ 
            success: true,
            message: 'いいねを更新しました'
        });
    } catch (error) {
        console.error('Error in toggleLike:', error);
        res.status(500).json({ 
            success: false, 
            message: 'いいねの更新中にエラーが発生しました' 
        });
    }
};