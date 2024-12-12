//=============================================================================
// routes/productRoutes.js
//
// 役割
//  商品データに関連するAPIエンドポイントを定義するためのルートファイルです
//  商品検索、全商品の取得、特定商品の取得など、ECサイトで商品データを管理するための
//  基本的な機能を提供します
//
// 目的
// - 商品データの管理:
//   商品の検索、一覧取得、詳細取得といった商品関連の操作を処理するためのエンドポイントを提供します
// 
// - バックエンドのAPI設計:
//   フロントエンドや他のサービスが利用する統一された商品管理APIを作成します
// 
// - コードの分離と再利用性の向上:
//   ルート定義とビジネスロジック（コントローラー）を分離し、コードの可読性と再利用性を高めます
//=============================================================================

const express = require('express');
const router = express.Router();

// 商品関連のコントローラをインポート
const productController = require('../controllers/productController');

// 全商品の一覧を取得するAPI
// クライアントに全ての商品データを返す
// 例: `/` で全商品を取得
router.get('/', productController.getAllProducts);       // `/` のルート

// 特定の商品をIDで取得するAPI
// URLパラメータで指定された商品IDの商品データを返す
// 例: `/:productId`（例: `/67382d86a0c5786afcfe6911`）で該当商品の詳細を取得
router.get('/:productId', productController.getProductById); // `/:productId` のルート

// いいね機能のルートを追加
router.post('/:productId/like', productController.toggleLike);  // いいねの切り替え用

// このルーターを他のモジュールで使用可能にする
module.exports = router;
