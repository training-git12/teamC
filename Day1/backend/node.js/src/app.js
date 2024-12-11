//=============================================================================
// src/app_day1_1.js
//
// 役割
//  サーバーのエントリーポイントとして機能し、必要なモジュールの読み込み、
//  データベースの接続、ミドルウェアの設定、ルートの登録、そしてサーバーの起動を行います
//
//目的
//  アプリケーションのバックエンドサーバーを構築し、クライアントがデータを操作したり
//  取得したりするためのAPIエンドポイントを提供します
//=============================================================================

// 必要なモジュールをインポート
const express = require('express');   // Expressフレームワークを使用してサーバーを構築
const cors = require('cors');         // CORSポリシーを設定するためのミドルウェア
const mongoose = require('mongoose'); // MongoDBと接続するためのODMライブラリ

// 商品関連のAPIルートを定義したモジュールをインポート
const productRoutes = require('./routes/productRoutes');

// Expressアプリケーションを作成
const app = express();

// サーバーがリッスンするポート番号を定義
const port = 3000;

// MongoDBに接続
mongoose.connect('mongodb://localhost/ecsite')   // 接続先のMongoDB URIを指定
  .then(() => console.log("MongoDB connected"))  // 接続成功時のログ
  .catch(err => console.error("MongoDB connection error:", err));  // 接続失敗時のエラーログ

// ミドルウェアの設定
app.use(cors());         // CORSを許可（クライアントが別のオリジンからアクセスできるようにする）
app.use(express.json()); // リクエストボディをJSONとして解析

// 商品関連のルートを/api/productsパスに適用
app.use('/api/products', productRoutes);

// サーバーの起動
app.listen(port, () => {
  // サーバーが正常に起動した場合にログを出力
  console.log(`Server running on http://localhost:${port}`);
});
