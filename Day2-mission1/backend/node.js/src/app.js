//=============================================================================
// src/app_day1_3.js
//
// 役割
//  サーバーのエントリーポイントとして機能し、必要なモジュールの読み込み、
//  データベースの接続、ミドルウェアの設定、ルートの登録、そしてサーバーの起動を行います
//
//目的
//  アプリケーションのバックエンドサーバーを構築し、クライアントがデータを操作したり
//  取得したりするためのAPIエンドポイントを提供します
//=============================================================================

// サーバーのエントリーポイント
// サーバーを起動し、他のルートやミドルウェアの設定を行うメインファイル
const express = require('express');   // Expressフレームワークを使用してサーバーを構築
const cors = require('cors');         // CORSポリシーを設定するためのミドルウェア
const mongoose = require('mongoose'); // MongoDBと接続するためのODMライブラリ

// APIルートを定義したモジュールをインポート
const productRoutes = require('./routes/productRoutes');
const likeRoutes = require('./routes/likeRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Expressアプリケーションを作成
const app = express();

// サーバーがリッスンするポート番号を定義
const port = 3000;

// データベース接続
mongoose.connect('mongodb://localhost/ecsite')   // 接続先のMongoDB URIを指定
  .then(() => console.log("MongoDB connected"))  // 接続成功時のログ
  .catch(err => console.error("MongoDB connection error:", err));  // 接続失敗時のエラーログ

// ミドルウェアの設定
app.use(cors());         // CORSを許可（クライアントが別のオリジンからアクセスできるようにする）
app.use(express.json()); // リクエストボディをJSONとして解析

// API ルートの設定
app.use('/api/products', productRoutes); // `/api/products` 以下のリクエストを productRoutes に委譲
app.use('/api', likeRoutes);             // `/api` 以下のリクエストを likeRoutes に委譲
app.use('/api/admin', adminRoutes);      // `/api/admin` 以下のリクエストを adminRoutes に委譲

// 全リクエストをログに記録
app.use((req, res, next) => {
  console.log('Incoming request:', req.path);
  next();  // 次のミドルウェアまたはルートに処理を渡す
});

// その他のリクエストをフロントエンドにリダイレクト
app.get('*', (req, res) => {
  console.log('Fallback route accessed app_day:', req.path); // デバッグログ
  
  // クライアントに適切なHTMLファイルを返す
  if (req.path.startsWith('/admin')) {
    res.sendFile(path.resolve(__dirname, '../frontend/vue.js/src/components/AdminPanel.vue'));
  } else if (req.path.startsWith('/productlist')) {
    res.sendFile(path.resolve(__dirname, '../frontend/vue.js/src/components/ProductList.vue'));
  } else {
    // リクエストされたパスが存在しない場合は404エラーを返す
    res.status(404).send('Not Found');
  }
});

// サーバーを開始
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
