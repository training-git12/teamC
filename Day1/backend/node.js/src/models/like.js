//=============================================================================
// models/like.js
//
// 役割
// ユーザーが特定の商品に「いいね」をした情報を記録するためのMongoDBモデルを定義します
// 具体的には、以下の内容をMongoDBのlikesコレクションに保存します：
// - 「いいね」をしたユーザーのID（userId）
// - 「いいね」をされた商品のID（productId）
// - 「いいね」をした日時（createdAt）
//
// 目的
// - 「いいね」データの構造を定義
//   ユーザーと商品間の「いいね」関係を管理するデータ構造を定義します
//   これにより、アプリケーションで「いいね」機能を実装できる基盤を提供します
// - リレーションの管理
//   ユーザー（userId）と商品（productId）を参照することで、MongoDB内でのリレーションを構築します
//   これにより、ユーザーが「いいね」した商品や、商品の「いいね」をしたユーザーを効率的に追跡できます
// - いいね履歴の記録
//   createdAtフィールドを使用して、いつ「いいね」が行われたかを記録します
//   ユーザー行動の追跡や時間ベースのデータ分析に活用できます
// - 再利用可能なモデルの作成:
//   アプリケーション全体で「いいね」に関連する処理にこのモデルを使用することで、
//   コードの一貫性と保守性を向上させます
//=============================================================================

// Mongooseライブラリをインポート
// MongoDBとのやり取りを簡易化するために使用されるODM（Object Data Modeling）ライブラリ
const mongoose = require('mongoose');

// Likeスキーマの定義
// ユーザーが「いいね」した情報を記録するデータ構造を定義
const likeSchema = new mongoose.Schema({
  // userId: いいねをしたユーザーのIDを記録
  // ref: 'User' はリレーション（参照）を示し、このフィールドがUserモデルを参照していることを表す
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // productId: いいねされた商品のIDを記録
  // ref: 'Product' はリレーション（参照）を示し、このフィールドがProductモデルを参照していることを表す
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },

  // createdAt: いいねが作成された日時を記録
  // デフォルト値として現在日時を設定
  createdAt: { type: Date, default: Date.now }
});

// スキーマを基にLikeモデルを作成し、外部で使用可能にする
// 第一引数: モデル名 'Like'
// 第二引数: スキーマ likeSchema
module.exports = mongoose.model('Like', likeSchema);
