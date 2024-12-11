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

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// product.json を読み込む
let products = [];
try {
    const productPath = path.join(__dirname, './data/product.json');
    const fileContent = fs.readFileSync(productPath, 'utf8');
    const data = JSON.parse(fileContent);
    products = data.products;  // 変換後のJSONの形式に合わせて修正
} catch (error) {
    console.error('Error reading product.json:', error);
}

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});