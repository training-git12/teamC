//=============================================================================
// src/router/index.js
//
// 役割
//  Vue.jsアプリケーションにおいてルーティング（ページ遷移）を管理するためのコードです
//  Vue Routerを使用して、URLパスに基づき異なるコンポーネント（ページ）を表示する仕組みを構築します
//
// - ルートの定義
//   アプリケーション内の異なるページをURLパスに紐づけます。
//   たとえば、productlistにアクセスするとProductList.vueが表示され、adminにアクセスすると
//   AdminPanel.vueが表示されるように設定します
//
// - ルートの動作設定
//   各ルートに特化した機能（beforeEnterガード）を追加し、ページ遷移時に特定のロジックを実行します
//   リダイレクトを設定し、指定された条件で別のルートに移動します
//
// - ナビゲーションガードの設定
//   アプリケーション全体で共通のナビゲーションロジックを追加します
//   これにより、ページ遷移の前後に特定の処理（ログ記録など）を行います
//
// - Vue Routerのインスタンス作成
//   定義されたルートと履歴モードの設定に基づいて、アプリケーション全体でルーターを利用できるようにします
//
// - エクスポート
//   作成したルーターインスタンスをエクスポートし、アプリケーションのエントリーポイント（main.js）で
//   登録して使用します
// 
// 目的
// - ページ遷移を管理
//   URLごとに適切なページを表示し、シングルページアプリケーション（SPA）の特性を活かしてスムーズな
//   ユーザー体験を提供します
// 
// - 開発効率の向上
//   各ページをコンポーネントとして分離し、ルーティングを通じて動的に切り替えることで、
//   再利用性の高いコードを実現します。
// 
// - 動的なルーティング制御
//   ナビゲーションガードやリダイレクト機能を活用することで、ページ遷移の制御や
//   セキュリティ要件を柔軟に管理します。
// 
// - プリケーションの統一的なナビゲーション管理
//   Vue Routerを統合することで、ルーティングに関するコードを集中管理し、可読性や保守性を向上させます
//=============================================================================

// Vue Routerのインポート
import { createRouter, createWebHistory } from 'vue-router';

import ProductList from '../components/ProductList.vue'; // 商品一覧コンポーネント
import AdminPanel from '../components/AdminPanel.vue';   // 管理者ページコンポーネント

// ルートの定義
// ルート管理: アプリケーション内で異なるページやコンポーネントを URL に応じて切り替える
const routes = [
  {
    path: '/productlist',   // 商品一覧ページのパス
    name: 'ProductList',    // ルート名（任意）
    component: ProductList, // このルートに対応するコンポーネント
  },
  {
    path: '/admin',         // 管理者ページのパス
    name: 'AdminPanel',     // ルート名（任意）
    component: AdminPanel,  // このルートに対応するコンポーネント
    
    // このルートに特化したガード
    // ガード機能: ページ遷移時に条件をチェックしたり、ログを記録する
    beforeEnter: (to, from, next) => {
      // 管理者ページへ遷移するときにログ出力
      console.log('Entering AdminPanel:', to.path);
      // 遷移を許可
      next();
    },
  },
  {
    //リダイレクト: 特定の条件下で適切なページに案内する
    path: '/',                // ルートパスへのアクセス
    redirect: '/productlist', // リダイレクト先（商品一覧ページ）
  },
];

// Vue Router のインスタンス作成
const router = createRouter({
  // 履歴モードを使用
  history: createWebHistory(),
  // 定義されたルートを登録
  routes,
});

// グローバルなナビゲーションガードの設定
router.beforeEach((to, from, next) => {
  // 遷移元と遷移先のパスをログ出力
  console.log('Navigating from:', from.path, 'to:', to.path);
  // 遷移を許可
  next();
});

// 初期化時の確認用ログ
console.log('Vue Router initialized');

// ルーターをエクスポート
export default router;
