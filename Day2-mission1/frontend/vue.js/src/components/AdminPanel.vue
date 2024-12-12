//=============================================================================
// src/components/AdminPanel.vue
//
// 管理者が必要な機能を提供するコンポーネントです
//=============================================================================

//-----------------------------------------------------------------------------
//テンプレートセレクション
// テンプレートセクションは、Vue コンポーネントの 見た目（UI）を定義します。
// HTMLに似た記法を使用し、動的データをバインドしてUIをレンダリングします。
//
// 全体の構造: 管理者が「いいね」情報をリセットしたり、商品一覧を確認できるインターフェースを提供します
// Vue.jsのテンプレートとElement Plusコンポーネントを使用しています
//-----------------------------------------------------------------------------
<template>
  <div>
    <!-- レイアウト全体をElement PlusのContainerを使用して設定 -->
    <el-container>
      <!-- ヘッダー部分 -->
      <el-header>
        <h1>管理者パネル</h1>
        <!-- タイトルと、必要に応じてヘッダー内にUIを追加 -->
      </el-header>

      <!-- メインコンテンツ -->
      <el-main>
        <!-- ユーザーごとの「いいね」リセット -->
        <h3>ユーザー別にリセット</h3>
        <el-form :inline="true">
          <!-- ユーザーID入力フォーム -->
          <el-form-item>
            <el-input
              v-model="userId"
              placeholder="ユーザーIDを入力"
              clearable
            />
          <!-- リセットボタン -->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="resetLikesByUser">リセット</el-button>
          </el-form-item>
        </el-form>

        <!-- 商品ごとの「いいね」リセット -->
        <h3>商品別にリセット</h3>
        <el-form :inline="true">
          <!-- 商品ID入力フォーム -->
          <el-form-item>
            <el-input
              v-model="productId"
              placeholder="商品IDを入力"
              clearable
            />
            
          <!-- リセットボタン -->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="resetLikesByProduct">リセット</el-button>
          </el-form-item>
        </el-form>

        <!-- 商品一覧と操作 -->
        <h3>商品一覧</h3>
        <!-- 商品一覧をElement Plusのテーブルで表示 -->
        <el-table :data="products" border style="width: 100%">
          <el-table-column prop="name" label="商品名" width="180" />
          <el-table-column prop="likes" label="いいね数" width="100" />
          <el-table-column label="操作">
            <template #default="scope">
              <!-- 個別商品の「いいね」リセットボタン -->
              <el-button
                type="danger"
                size="small"
                @click="resetLikesForProduct(scope.row._id)"
              >
                この商品のいいねをリセット
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 操作結果のメッセージ -->
        <el-alert
          v-if="message"
          :title="message"
          type="success"
          show-icon
          style="margin-top: 20px"
        />
      </el-main>
    </el-container>
  </div>
</template>


//-----------------------------------------------------------------------------
//スクリプトセレクション
// スクリプトセクションは、コンポーネントの ロジック や データ管理 を記述します
// 主に JavaScript を使い、Vue コンポーネントの機能を実装します
//
// 全体の目的: 商品の一覧データを取得し、特定のユーザーや商品に対して「いいね」のリセット操作を行う
//-----------------------------------------------------------------------------
<script>

//axios は HTTP リクエストを送信するためのライブラリです
// API サーバーと通信するために使用します
// フロントエンド（Vue.js）からバックエンド（Node.js など）にデータをやり取りするためのツールです
//  例: サーバーからデータを取得する (GET)、データを送信する (POST)
import axios from "axios";

export default {
  //data プロパティ
  data() {
    return {
      userId: "",    // リセット対象のユーザーID
      productId: "", // リセット対象の商品ID
      message: "",   // 操作結果メッセージ（成功またはエラー）
      products: [],  // 商品一覧データ
    };
  },
  
  //ライフサイクルフック
  created() {
    // コンポーネントが作成されたときに商品一覧を取得
    this.fetchProducts();
  },
  
  methods: {
    //商品一覧の取得
    // 目的: 商品データをAPIから取得してテーブルに表示
    async fetchProducts() {
      try {
        const response = await axios.get("http://54.248.228.85:3000/api/products");
        // APIから取得したデータをproductsに格納
        this.products = response.data;
        // デバッグ用
        console.log("商品一覧取得成功:", this.products);
      } catch (error) {
        console.error("商品一覧の取得に失敗しました", error);
      }
    },
    
    //ユーザーごとの「いいね」リセット
    // 目的: 特定ユーザーの「いいね」データをリセット
    // リクエスト: API にユーザーIDをPOSTし、該当する「いいね」をリセット
    async resetLikesByUser() {
      if (!this.userId) {
        this.message = "ユーザーIDを入力してください";
        console.error("ユーザーIDが入力されていません");
        return;
      }

      try {
        const response = await axios.post(
          "http://54.248.228.85:3000/api/admin/reset-likes-by-user",
          { userId: this.userId }
        );
        this.message = response.data.message;  // 操作結果を表示
        this.fetchProducts();                  // 商品一覧を更新
      } catch (error) {
        this.message = "エラーが発生しました";
        console.error("Error resetting likes by user:", error);
      }
    },
    
    //商品ごとの「いいね」リセット
    // 目的: 特定商品の「いいね」データをリセット
    async resetLikesByProduct() {
      if (!this.productId) {
        this.message = "商品IDを入力してください";
        console.error("商品IDが入力されていません");
        return;
      }

      try {
        const response = await axios.post(
          "http://54.248.228.85:3000/api/admin/reset-likes-by-product",
          { productId: this.productId }
        );
        this.message = response.data.message;
        this.fetchProducts(); // 商品一覧を再取得してリフレッシュ
      } catch (error) {
        this.message = "エラーが発生しました";
        console.error("Error resetting likes by product:", error);
      }
    },
    
    //商品テーブルから「いいね」リセット
    // 目的: 商品一覧テーブル内の「操作」列から、特定商品の「いいね」をリセット
    async resetLikesForProduct(productId) {
      try {
        const response = await axios.post(
          "http://54.248.228.85:3000/api/admin/reset-likes-by-product",
          { productId }
        );
        this.message = response.data.message;
        this.fetchProducts(); // 商品一覧を再取得してリフレッシュ
      } catch (error) {
        this.message = "エラーが発生しました";
        console.error("Error resetting likes for product:", error);
      }
    },
  },
};


//-----------------------------------------------------------------------------
//スタイルセレクション
// スタイルセクションは、コンポーネントのデザインやレイアウトを定義します。CSSやSCSSなどを記述します
//
// Element Plusコンポーネントのスタイルを調整
//-----------------------------------------------------------------------------
</script>

<style>
/* 全体レイアウト調整 */
.el-container {
  padding: 20px; /* コンテナ全体の余白を設定 */
}
.el-header h1 {
  margin: 0;     /* ヘッダーのタイトル余白をリセット */
}
</style>
