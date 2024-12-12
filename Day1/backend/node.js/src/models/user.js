//=============================================================================
// models/User.js
//
// 役割
// MongoDBのuserコレクションを操作するためのMongooseモデル（User）を定義します
// ユーザー情報のデータ構造や制約を管理し、アプリケーション内でユーザーに関連する
// 操作を統一した形式で実現します
//
// 目的
// - ユーザー情報の管理
//   各ユーザーの基本情報（ユーザー名、メールアドレス、パスワードなど）を一元管理します
//   ユーザーが「いいね」した商品の情報を追跡します
// - データベースとの連携
//   MongoDBのuserコレクションと連携し、ユーザー関連のCRUD操作（作成、取得、更新、削除）を簡略化します
// - データ構造の一貫性を保証
//   スキーマを定義することで、保存されるデータの形式や型を統一し、不正なデータが保存されるのを防ぎます
// - ユーザーと商品との関係性を管理
//   ユーザーが「いいね」した商品のIDを追跡し、Productモデルとの関連付けを可能にします
//=============================================================================

const mongoose = require('mongoose');

// ユーザーのスキーマ定義
// MongoDB内の`user`コレクションに対応するデータ構造を定義します
const userSchema = new mongoose.Schema({

    // ユーザー名
    username: String,
    
    // メールアドレス
    email: String,
    
    // パスワード
    password: String,
    
    // デフォルト値として現在時刻を設定
    created_at: { type: Date, default: Date.now },
    
    // ユーザーが「いいね」した商品
    likedProducts: [
        {
            // `Product`モデルと関連付けられたObjectIdを参照します
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product' // リファレンス先モデル名を指定（`Product`モデル）
        }
    ]
});

// スキーマに基づくモデルを作成
// 第3引数の 'user' はMongoDBのコレクション名を明示的に指定しています
module.exports = mongoose.model('User', userSchema, 'user');
