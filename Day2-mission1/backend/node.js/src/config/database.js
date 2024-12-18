//=============================================================================
// config/database.js
//
// 役割：MongoDBに接続する設定と処理を管理するモジュールです
// - MongoDBへの接続URIの設定
// - Mongooseを用いたMongoDBへの接続処理
// - 接続成功または失敗時のログ出力およびエラーハンドリング
//
// 目的
// - データベース接続の簡素化
//   MongoDBへの接続設定を一元化することで、アプリケーション全体で再利用可能にします
// - 接続エラーのハンドリング
//   接続失敗時にエラーメッセージを出力し、プロセスを終了させることで、問題の迅速な発見や修正を促進します
// - 環境変数の活用
//   開発環境や本番環境に応じて、異なるMongoDB URIを柔軟に切り替えられる設計を提供します
//=============================================================================

const mongoose = require('mongoose');

// MongoDBに接続するための非同期関数
const connectDB = async () => {
    try {
        // MongoDBの接続URIを取得
        // 環境変数 `MONGO_URI` が設定されていればそれを使用し、
        // 設定されていなければデフォルト値としてローカルホストのURIを使用
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost/ecsite';
        
        // Mongooseを使用してMongoDBに接続
        // MongoDBの接続が成功するまで待機
        await mongoose.connect(mongoURI);  // オプションが不要な場合は削除

        // 接続成功のメッセージを出力
        console.log('MongoDB connected');
    } catch (error) {
        // 接続失敗時のエラーメッセージを出力
        console.error('MongoDB connection error:', error);
        
        // プロセスを終了させる（非ゼロステータスコードで終了）
        // これにより、重大なエラーの場合にアプリケーションを再起動できるようにする
        process.exit(1);
    }
};

// このモジュールを外部で使用可能にするためにエクスポート
module.exports = connectDB;
