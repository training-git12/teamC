//=============================================================================
// src/components/ProductList.vue
//
// 商品データを表示し、詳細情報や「いいね」機能などを提供するコンポーネントです
//=============================================================================

//-----------------------------------------------------------------------------
//テンプレートセレクション
// テンプレートセクションは、Vue コンポーネントの 見た目（UI）を定義します
// HTMLに似た記法を使用し、動的データをバインドしてUIをレンダリングします
//
// 動的データのバインディング:
//   {{}}（マスタッシュ記法）を使用して、スクリプトセクションで定義したデータや計算プロパティを表示できます
// ディレクティブ:
//   Vue.js 独自の属性（ディレクティブ）を利用して、HTML要素に動的な振る舞いを追加します
//   例: v-if、v-for、v-bind、v-on。
//-----------------------------------------------------------------------------
<template>
  <div class="product-list">
    <h1>商品一覧</h1>
    
    <!-- 商品をカード形式で表示 -->
    <div class="product-grid">
      <!-- 商品ごとにループ(v-for)してカードを生成 -->
      <!-- Vue.jsではループで生成される要素に一意のキー(key)を設定する必要があります -->
      <!-- ホバー時に影を表示 -->
      <el-card
        v-for="product in products" :key="product._id"
        class="product-card"
        shadow="hover"  
      >
        <!-- 商品画像 -->
        <img :src="product.images[0]" alt="Product Image" class="product-image" />
        
        <div class="product-info">
          <!-- 商品名 -->
          <h2>{{ product.name }}</h2>
          <!-- 価格 -->
          <p class="price">価格: {{ product.price }}円</p>
          <!-- 商品説明 -->
          <p class="description">{{ product.description }}</p>

          <!-- いいねボタン -->
          <el-button
            class="like-button"
            :class="{ 'is-liked': product.isLiked }"
            @click="toggleLike(product)"
            text
          >
            <el-icon :size="20">
              <svg v-if="product.isLiked" viewBox="0 0 24 24" fill="#ff4757" class="heart-icon">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="#888" class="heart-icon">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </el-icon>
          </el-button>

          <!-- 詳細ボタン（クリックでモーダルを表示） -->
          <el-button type="primary" @click="showDetails(product)">詳細</el-button>
        </div>
      </el-card>
    </div>

    <!-- 商品詳細モーダル -->
    <el-dialog v-model="dialogVisible" title="商品詳細" width="50%">
      <!-- モーダル内に選択された商品の詳細を表示 -->
      <div v-if="selectedProduct">
        <!-- モーダル内の商品画像 -->
        <img :src="selectedProduct.images[0]" alt="Product Image" class="modal-image" />
        <!-- 価格情報 -->
        <p><strong>価格:</strong> {{ selectedProduct.price }}円</p>
        <!-- 商品説明 -->
        <p><strong>説明:</strong> {{ selectedProduct.description }}</p>
        <!-- ブランド -->
        <p><strong>ブランド:</strong> {{ selectedProduct.brand }}</p>
        <!-- 商品仕様 -->
        <p>
          <strong>仕様:</strong> 素材 - {{ selectedProduct.specifications.material }},
          長さ - {{ selectedProduct.specifications.length }}
        </p>
      </div>
      <!-- モーダルのフッター（閉じるボタン） -->
      <template #footer>
        <el-button @click="closeModal">閉じる</el-button>
      </template>
    </el-dialog>
  </div>
</template>

//-----------------------------------------------------------------------------
//スクリプトセレクション
// スクリプトセクションは、コンポーネントの ロジック や データ管理 を記述します
// 主に JavaScript を使い、Vue コンポーネントの機能を実装します
//
// オブジェクト形式で定義
// ・data    : コンポーネントの状態を保持
// ・methods : ユーザーアクションやカスタムロジックを実装
// ・computed: データの派生値（キャッシュされる）
// ・watch   : 特定のデータの変化を監視し、対応する処理を実行
// ・ライフサイクルフック: コンポーネントの初期化や破棄時に実行するコードを記述（例: mounted）
//-----------------------------------------------------------------------------
<script>
import axios from "axios";

export default {
  data() {
    return {
      products: [],          // 商品リストを格納
      selectedProduct: null, // 選択された商品の情報を格納
      dialogVisible: false,  // モーダルの表示/非表示を制御
    };
  },
  methods: {
    // 商品リストをAPIから取得
    async fetchProducts() {
      try {
        // APIリクエスト
        // const response = await axios.get("http://18.178.128.74:3000/api/products");
        const response = await axios.get("http://localhost:3000/api/products");     // ローカルで立ち上げる場合
        // 商品リストをデータに設定
        this.products = response.data;
      } catch (error) {
        // エラー時の処理
        console.error(error);
      }
    },
    // 商品詳細モーダルを表示
    showDetails(product) {
      this.selectedProduct = product; // 選択された商品をセット
      this.dialogVisible = true;      // モーダルを表示
    },
    // モーダルを閉じる
    closeModal() {
      this.dialogVisible = false;    // モーダルを非表示
      this.selectedProduct = null;   // 選択された商品をクリア
    },
    // いいね機能の切り替え
    async toggleLike(product) {
      try {
        const response = await axios.post(`http://localhost:3000/api/products/${product._id}/like`);
        if (response.data.success) {
          // いいね状態のみを切り替え
          product.isLiked = !product.isLiked;
        }
      } catch (error) {
        console.error('Error toggling like:', error);
        this.$message({
          message: 'いいねの更新に失敗しました',
          type: 'error'
        });
      }
    },
    // 商品データ取得時にisLikedプロパティを追加
    async fetchProducts() {
      try {
        const response = await axios.get("http://localhost:3000/api/products");
        // 各商品にisLikedプロパティを追加
        this.products = response.data.map(product => ({
          ...product,
          isLiked: false // 初期状態は「いいねしていない」
        }));
      } catch (error) {
        console.error(error);
      }
    },
  },
  // コンポーネントのマウント時に商品リストを取得
  mounted() {
    this.fetchProducts();
  },
};
</script>

//-----------------------------------------------------------------------------
//スタイルセレクション
// スタイルセクションは、コンポーネントのデザインやレイアウトを定義します。CSSやSCSSなどを記述します
//
// コンポーネントスコープ
// ・スタイルをそのコンポーネントに限定することができます（scoped 属性）
// プリプロセッサ
// ・SCSS、LESS、Stylus などの CSS 拡張言語を利用可能
//-----------------------------------------------------------------------------
<style>
/* 商品リスト全体のスタイル */
.product-list {
  max-width: 1200px;   /* コンテンツの最大幅を指定 */
  margin: auto;        /* コンテンツを中央寄せ */
  text-align: center;  /* テキストを中央揃え */
}

/* 商品カードのグリッドレイアウト */
.product-grid {
  display: grid;  /* グリッドレイアウトを使用 */
  gap: 20px;      /* 各カード間のスペース */
  /* カラムを自動調整 */
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
}

/* 商品カードのデザイン */
.product-card {
  padding: 20px;                    /* カード内の余白を設定 */
  border: 1px solid #eee;           /* カードの枠線の色を薄いグレーに設定 */
  display: flex;                    /* フレックスボックスを使用 */
  flex-direction: column;           /* 縦方向に配置 */
  justify-content: space-between;   /* 上下の要素を均等配置 */
  height: 100%;                     /* 高さを揃える */
}

/* 商品情報のレイアウト */
.product-info {
  display: flex;                    /* フレックスボックスを使用 */
  flex-direction: column;           /* 情報を縦方向に配置 */
  flex-grow: 1;                     /* スペースを確保 */
  justify-content: space-between;   /* 上下の要素間を均等に配置 */
}

/* 商品画像のスタイル */
.product-image {
  width: 100%;         /* 横幅をカード全体に合わせる */
  height: auto;        /* 縦横比を維持しながら画像をリサイズ */
  margin-bottom: 10px; /* 下に余白を追加 */
}

/* 価格のテキストデザイン */
.price {
  font-weight: bold;  /* テキストを太字に設定 */
  color: #555;        /* ダークグレーの色を使用 */
}

/* 商品説明テキスト */
.description {
  margin: 10px 0;   /* 上下に余白を追加 */
  flex-grow: 1;     /* ボタンを下部に配置するための余白確保 */
}

/* モーダル内の画像スタイル */
.modal-image {
  width: 50%;            /* 画面幅に応じたサイズ調整 */
  height: auto;          /* 縦横比を維持してリサイズ */
  margin-bottom: 20px;   /* 下に余白を追加 */
}

.like-button {
  transition: all 0.3s ease;
  padding: 8px;
  margin: 10px 0;
}

.like-button:hover .heart-icon {
  transform: scale(1.1);
}

.like-button:active .heart-icon {
  transform: scale(0.95);
}

.heart-icon {
  transition: all 0.3s ease;
}

/* ボタンの背景を削除 */
.like-button.el-button {
  border: none;
  background: transparent;
}
</style>
