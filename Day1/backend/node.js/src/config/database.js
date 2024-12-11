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
