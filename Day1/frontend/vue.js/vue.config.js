//=============================================================================
// vue.config.js
// 
// このプログラムは、Vue CLIプロジェクトの設定ファイル（vue.config.js） です
// Vue.jsアプリケーションのビルドプロセスや開発サーバーの挙動をカスタマイズするための設定を定義します
// 
// 役割
// - 開発サーバー設定
//   開発中のサーバー環境を柔軟にカスタマイズ（ポート番号、プロキシ、ホスト設定など）できます
//   外部デバイスからのアクセスやAPIリクエストのプロキシ転送をサポートします
//
// - プロジェクトビルド設定
//   アプリケーションの公開パスや依存関係のトランスパイル設定を指定し、ビルド結果の最適化を実現します
//
// - Webpack設定
//   Webpackの機能を利用してカスタム設定やプラグインを追加できます
//   特定の機能（例: WebSocket設定や警告抑制）を実現できます
//
// - SPA（シングルページアプリケーション）のサポート
//   historyApiFallback を利用して、SPAでのルーティングを有効にできます
// 
// 目的
// - 開発効率の向上
//   プロキシ設定により、フロントエンドとバックエンドの通信をシームレスに行います
//   ホットリロードやWebSocket設定で、効率的な開発環境を提供します
// 
// - 柔軟なデプロイ設定
//   公開パスや依存関係のトランスパイル設定を通じて、異なる環境（開発/本番）に対応します
// 
// - アプリケーションの統一的な挙動管理
//   ビルドや開発サーバーの設定を一元化し、可読性と保守性を向上します
//=============================================================================

//この関数を使うことで、Vue CLI に適した形式で設定を定義できます
//defineConfig を使うと、自動補完や型チェックが向上するため、設定ミスを減らせる利点があります
//Vue CLI において、vue.config.js を簡潔で安全に記述するための推奨方法です
const { defineConfig } = require('@vue/cli-service');

//Webpack の機能を使って、開発環境やビルド環境でカスタム設定を行うために利用します
const webpack = require('webpack'); // webpack をインポート

//defineConfig は Vue CLI 向けの簡潔な設定記述です
module.exports = defineConfig({
  // publicPath: アプリケーションの「起点となるURL」を設定するプロパティ。
  publicPath: '/',

  transpileDependencies: true, // 必要に応じて特定の依存関係をトランスパイルする設定

  devServer: {
    // 開発サーバーのホスト名を設定。'0.0.0.0' にすると、外部デバイスからもアクセス可能。
    host: '0.0.0.0',

    // 開発サーバーがリッスンするポート番号を指定。
    port: 8080,

    // 外部ホストからのアクセスを許可する設定。
    allowedHosts: 'all',

    // historyApiFallback: SPA のためのルーティングをサポート。
    historyApiFallback: true,

    // プロキシ設定: バックエンドサーバーへのリクエストを転送。
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // バックエンドサーバーのアドレス
        changeOrigin: true,              // CORS を許可する設定
      },
    },

    // WebSocket の設定（ホットリロードやリアルタイム通信に対応するための設定）
    client: {
      webSocketURL: {
        protocol: 'ws',            // WebSocket通信プロトコル
        hostname: '36.76.17.88',   // 公開されているホスト名または IP アドレス
        port: 8080,                // WebSocket通信のポート番号
      },
    },
  },

  //Webpack設定
  configureWebpack: {
    // 追加の Webpack 設定を定義
    plugins: [
      new webpack.DefinePlugin({
        // ブラウザのコンソールに出現する feature flags の警告を抑制
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      }),
    ],
  },
});
