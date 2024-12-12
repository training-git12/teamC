//=============================================================================
// models/product.js
//
// 役割
// MongoDBのproductコレクションに対応するデータモデル（Product）を定義します
// 商品データの構造や制約を管理するためのスキーマを作成し、アプリケーション内で
// 商品データを効率的に操作するための基盤を提供します
//
// 目的
// - 商品データの構造定義
//   商品名、説明、価格、在庫など、商品の基本情報をスキーマとして定義します
//   各フィールドに適切なデータ型やデフォルト値を指定します
// - MongoDBとの連携
//   商品データをproductコレクションに保存したり、取得したりする際にMongooseを通じて操作を簡単に行います
// -商品データの一貫性を保証
//   定義されたスキーマを基にデータの整合性を保ち、不正なデータが保存されるのを防ぎます
// - 再利用可能なモデル作成
//   このモデルを通じて、アプリケーション全体で商品データの操作を統一します
//=============================================================================

// Mongooseライブラリをインポート
// MongoDBとやり取りするために使用されるODM（Object Data Modeling）ライブラリ
const mongoose = require('mongoose');

// 商品データを表現するスキーマを定義
// MongoDBのコレクション「product」に対応するスキーマを作成します
const productSchema = new mongoose.Schema({
  // 商品名（例: "高級なコンパス"）
  name: String,
  
  // 商品の説明（例: "高級な素材で作られたコンパスです"）
  description: String,
  price: Number,
  
  // 商品カテゴリー（例: "文房具"）
  category: String,
  
  // 商品のタイプ（例: "コンパス"）
  type: String,
  
  // 商品のブランド名（例: "高級ブランド"）
  brand: String,
  
  // 在庫数（例: 100個）
  stock: Number,
  
  // 商品画像のURLを格納する配列
  // 複数の画像URLを保存可能
  images: [String],
  
  // 商品の評価（例: 4.5）
  rating: Number,
  
  // 商品の仕様（例: { material: "金属", size: "10cm" }）
  specifications: Object,
  
  // 割引率（例: 20 => 20%割引）
  discount: Number,
  
  // 商品が作成された日時
  created_at: Date,
  
  // 商品が最後に更新された日時
  updated_at: Date,
  
  // 商品に関連するタグ（例: ["コンパス", "文房具"]）
  tags: [String],
  
  // 商品に対するレビューの配列
  reviews: [
    {
      // レビューを投稿したユーザーのID
      user_id: mongoose.Schema.Types.ObjectId,
      
      // レビューの評価（例: 5 => 5つ星）
      rating: Number,
      
      // レビューのコメント（例: "とても良い商品でした！"）
      comment: String,
      
      // レビュー投稿日時
      date: Date,
    },
  ],
});

// Mongooseモデルを作成
// 第一引数: モデル名 ('Product') 
// 第二引数: スキーマ (productSchema)
// 第三引数: コレクション名 ('product') 明示的に指定
module.exports = mongoose.model('Product', productSchema, 'products');
