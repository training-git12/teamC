//=============================================================================
// src/eventBus.js
//
// 役割:
//  - Vue.js アプリケーション内のコンポーネント間でイベントを共有するための基盤を提供
//  - ref を用いてリアクティブなイベントストレージを作成し、イベントの監視・発行を実現
//
// 目的:
//  - コンポーネント間のデータ共有を簡単にする
//  - Vuex や Pinia を使わずに軽量な状態管理を可能にする
//  - 小規模なアプリケーションでの効率的な通信手段を提供する
//=============================================================================

//ref は Vue 3 のリアクティブ性を提供する API の一部です
import { ref } from 'vue';

// イベントバスを作成
// ref({}) を使うことで、オブジェクト型のリアクティブデータ（eventBus）を作成しています
export const eventBus = ref({});
