//=============================================================================
// routes/likeRoutes.js
//
// 役割
//  このプログラムは、ECサイトにおける「いいね」機能を管理するためのルートを提供します
//  主にユーザーが商品に「いいね」したり、特定のユーザーが「いいね」した商品の情報を
//  取得する機能をサポートします
//
// 目的
// - 「いいね」機能の提供: ユーザーが商品に「いいね」する操作を可能にし、その情報をデータベースに保存します
// - ユーザーエクスペリエンスの向上: ユーザーが「いいね」した商品を簡単に確認できる機能を提供します
// - バックエンドAPIのモジュール化: 「いいね」関連のエンドポイントを専用ルートにまとめ、コードの分離と可読性を向上させます
//=============================================================================

const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

// 商品にいいねを追加するエンドポイント
router.post('/like', likeController.likeProduct);

// 特定ユーザーの「いいね」された商品IDを取得するエンドポイント
router.get('/liked-products/:userId', likeController.getLikedProducts);

//router オブジェクトを他のファイルで使用できるようにモジュールとしてエクスポート
module.exports = router;
